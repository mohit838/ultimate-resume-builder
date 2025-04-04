import { DB_CONFIG } from "@/config/AppConstant"
// import chalk from "chalk"
import { createLogger, format, transports } from "winston"
import "winston-mongodb"

// MongoDB URI for logging
const mongoUri = DB_CONFIG.mongoUrl

if (!mongoUri) {
    throw new Error("MongoDB URI is not defined in environment variables")
}

// Define collection names for audit logs and login history
const auditLogCollection = "audit_logs"
const loginHistoryCollection = "login_history"

let loggerInstance: ReturnType<typeof createLogger> | null = null

// Singleton Logger
function getLogger() {
    if (!loggerInstance) {
        loggerInstance = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
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

                // MongoDB transport for audit logs
                new transports.MongoDB({
                    level: "audit-info",
                    db: mongoUri,
                    collection: auditLogCollection,
                    format: format.combine(format.timestamp(), format.json()),
                    metaKey: "meta",
                }),

                // MongoDB transport for login history
                new transports.MongoDB({
                    level: "login-info",
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
