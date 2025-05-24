import cors from "cors"
import express, { Request, Response } from "express"
import helmet from "helmet"
import http from "http"
import morgan from "morgan"

// Mount routes
import authRoutes from "@/routes/auth.routes"
import logRoutes from "@/routes/logs.routes"

import { ALLOWED_ORIGINS, SERVICE_CONFIG } from "./config/AppConstant"
import Database from "./config/dbConfig"
import redisClient from "./config/redisClient"
import { errorHandler } from "./errors/errorHandler"
import logger from "./logger/logger"
import appRateLimiter from "./utils/appRateLimiter"

// Create Express app
const app = express()
const serviceName = SERVICE_CONFIG.name
const servicePort = Number(SERVICE_CONFIG.port) || 1234

// CORS setup
const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    credentials: true,
}

// Global middleware
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json({ limit: "3mb" }))
app.use(appRateLimiter)
app.use(
    morgan("dev", {
        stream: { write: (msg) => logger.info(msg.trim()) },
    })
)

app.use("/api/auth", authRoutes)
app.use("/api/logs", logRoutes)

// Health check
app.get("/health", async (_req: Request, res: Response) => {
    try {
        await redisClient.ping()
        res.status(200).json({ msg: "Service health is ok!" })
    } catch (err: any) {
        res.status(500).json({
            msg: "Health check failed",
            error: err.message,
        })
    }
})

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ msg: "Route not found!" })
})

// Global error handler
app.use(errorHandler)

// Create HTTP server
const server = http.createServer(app)

async function startServer() {
    try {
        // Initialize DB (Redis already auto-connects)
        await Database.getInstance()

        server.listen(servicePort, () => {
            logger.info(`${serviceName} is listening on port ${servicePort}`)
        })
    } catch (err: any) {
        // Log full stack
        logger.error("❌ Failed to start server", err.stack || err)
        process.exit(1)
    }
}

// Graceful shutdown
async function shutdown() {
    logger.info("⚙️  Shutting down gracefully…")

    server.close(async (closeErr) => {
        if (closeErr) {
            logger.error("Error closing HTTP server", closeErr)
            process.exit(1)
        }
        try {
            redisClient.destroy()
            await Database.close()
            logger.info("✅ Closed Redis and MySQL connections.")
            process.exit(0)
        } catch (cleanupErr: any) {
            logger.error("Error during shutdown cleanup", cleanupErr)
            process.exit(1)
        }
    })

    // Force exit if not closed within 10 seconds
    setTimeout(() => {
        logger.warn("💥 Shutdown timed out, forcing exit.")
        process.exit(1)
    }, 10_000)
}

// Listen for termination signals
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

// Start everything
startServer()

export default app
