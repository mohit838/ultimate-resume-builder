import cors from "cors"
import express, { Request, Response } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { ALLOWED_ORIGINS, SERVICE_CONFIG } from "./config/AppConstant"
import Database from "./config/dbConfig"
import redisClient from "./config/redisClient"
import { errorHandler } from "./errors/errorHandler"
import logger from "./logger/logger"
import appRateLimiter from "./utils/appRateLimiter"

const app = express()
const serviceName = SERVICE_CONFIG.name
const servicePort = SERVICE_CONFIG.port || 1234

// Configure CORS
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json({ limit: "3mb" }))
app.use(appRateLimiter)

// Logger
app.use(
    morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
    })
)

// API routes
// upcomming

// Health check route
app.get("/health", async (_req: Request, res: Response) => {
    try {
        await redisClient.ping()
        res.status(200).json({ msg: "Service health is ok!" })
    } catch (error: any) {
        res.status(500).json({
            msg: "Service health check failed!",
            error: error.message,
        })
    }
})

// 404 route
app.use((_req: Request, res: Response) => {
    res.status(404).json({ msg: "Route not found!" })
})

// Error handler
app.use(errorHandler)

// Server setup
async function initializeServer() {
    try {
        // Connect MySQL
        await Database.getInstance()

        app.listen(servicePort, () => {
            console.log(`${serviceName} is listening on port ${servicePort}`)
        })
    } catch (error: any) {
        console.error(
            "Failed to set up or connect to the database:",
            error.message
        )
        process.exit(1)
    }
}

// Graceful shutdown
const shutdown = async () => {
    await redisClient.disconnect()
    await Database.close()
    console.log("MySQL and Redis clients have been closed.")
    process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

initializeServer()

export default app
