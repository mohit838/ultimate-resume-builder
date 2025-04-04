import logger from "@/logger/logger"
import { NextFunction, Request, Response } from "express"
import { CustomError } from "./CustomError"

export const errorHandler = (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    const statusCode = err instanceof CustomError ? err.status : 500

    logger.error(`${statusCode} - ${err.message} - ${req.method} ${req.url}`)

    res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Internal Server Error"
                : err.message || "Something went wrong",
    })

    if (statusCode === 500) console.error(err.stack)
}
