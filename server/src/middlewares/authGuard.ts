import redisClient from "@/config/redisClient"
import { CustomError } from "@/errors/CustomError"
import { verifyAccessToken } from "@/utils/jwt"
import { NextFunction, Request, Response } from "express"

export const blockIfAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return next()

    const token = authHeader.split(" ")[1]
    try {
        verifyAccessToken(token)
        throw new CustomError("Already authenticated", 403)
    } catch {
        return next()
    }
}

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new CustomError("Unauthorized", 401)

    const token = authHeader.split(" ")[1]

    // Check Redis blacklist first
    const isBlacklisted = await redisClient.get(`bl_${token}`)
    if (isBlacklisted) throw new CustomError("Token is blacklisted", 401)

    try {
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch {
        throw new CustomError("Invalid or expired token", 401)
    }
}
