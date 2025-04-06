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

// Create app
const app = express()
const serviceName = SERVICE_CONFIG.name
const servicePort = Number(SERVICE_CONFIG.port) || 1234

// CORS
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

// Middleware
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json({ limit: "3mb" }))
app.use(appRateLimiter)
app.use(
    morgan("dev", {
        stream: { write: (message) => logger.info(message.trim()) },
    })
)

// Routes
import logRoutes from "@/routes/logs.routes"
import authRoutes from "./routes/auth.routes"

app.use("/api/auth", authRoutes)
app.use("/api/logs", logRoutes)

// Health check route
app.get("/health", async (_req: Request, res: Response) => {
    try {
        await redisClient.ping()
        res.status(200).json({ msg: "Service health is ok!" })
    } catch (error: any) {
        res.status(500).json({
            msg: "Health check failed",
            error: error.message,
        })
    }
})

// 404
app.use((_req: Request, res: Response) => {
    res.status(404).json({ msg: "Route not found!" })
})

// Global error handler
app.use(errorHandler)

// Start server
async function initializeServer() {
    try {
        await Database.getInstance()

        // only execute for first time
        // ensureTablesExist()

        app.listen(servicePort, () => {
            console.log(`${serviceName} is listening on port ${servicePort}`)
        })
    } catch (error: any) {
        console.error("❌ Failed to start server:", error.message)
        process.exit(1)
    }
}

// Graceful shutdown
const shutdown = async () => {
    await redisClient.disconnect()
    await Database.close()
    console.log("✅ Redis and MySQL connections closed.")
    process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

initializeServer()

export default app
