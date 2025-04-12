import { DB_CONFIG } from "@/config/AppConstant"
import { createLogger, format, transports } from "winston"
import "winston-mongodb"

const mongoUri = DB_CONFIG.mongoUrl
if (!mongoUri) throw new Error("MongoDB URI is not defined")

const auditLogCollection = "audit_logs"
const loginHistoryCollection = "login_history"

// Define custom levels
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        audit: 3,
        login: 4,
    },
    colors: {
        audit: "cyan",
        login: "magenta",
    },
}

let loggerInstance: ReturnType<typeof createLogger> | null = null

function getLogger() {
    if (!loggerInstance) {
        loggerInstance = createLogger({
            levels: customLevels.levels,
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.printf(({ timestamp, level, message, stack }) => {
                    return `${timestamp} ${level}: ${stack || message}`
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "logs/combined.log" }),
                new transports.File({
                    filename: "logs/error.log",
                    level: "error",
                }),

                // MongoDB for audit logs
                new transports.MongoDB({
                    level: "audit",
                    db: mongoUri,
                    collection: auditLogCollection,
                    format: format.combine(format.timestamp(), format.json()),
                    metaKey: "meta",
                }),

                // MongoDB for login history
                new transports.MongoDB({
                    level: "login",
                    db: mongoUri,
                    collection: loginHistoryCollection,
                    format: format.combine(format.timestamp(), format.json()),
                    metaKey: "meta",
                }),
            ],
        })
    }

    return loggerInstance
}

const logger = getLogger()
export default logger
