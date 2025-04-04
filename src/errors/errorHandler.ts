import { CustomError } from "@/errors/CustomError"
import logger from "@/logger/logger"
import { Request, Response } from "express"

export const errorHandler = (
    err: Error & { status?: number },
    req: Request,
    res: Response
) => {
    // Determine status code from CustomError, or fallback to default
    const statusCode = err instanceof CustomError ? err.status : 500

    // Log the error
    logger.error(`${statusCode} - ${err.message} - ${req.method} - ${req.url}`)

    // Respond to client
    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal Server Error"
                : err.message || "An unexpected error occurred",
    })

    // Optionally log stack trace in development for server errors
    if (statusCode === 500) {
        console.error(err.stack)
    }
}
