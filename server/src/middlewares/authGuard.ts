import { SERVICE_SECURITIES } from "@/config/AppConstant"
import redisClient from "@/config/redisClient"
import { CustomError } from "@/errors/CustomError"
import { JwtPayload, verifyAccessToken } from "@/utils/jwt"
import { NextFunction, Request, Response } from "express"
import jwt, { JsonWebTokenError } from "jsonwebtoken"

const jwtSecret = SERVICE_SECURITIES.jwt_secret

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

export const allowExpiredAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("Unauthorized: Access token missing", 401)
    }

    const token = authHeader.split(" ")[1]

    try {
        // Decode token while ignoring expiration
        const decoded = jwt.verify(token, jwtSecret, { ignoreExpiration: true })

        if (typeof decoded === "string") {
            throw new CustomError("Invalid token payload", 401)
        }

        const now = Math.floor(Date.now() / 1000)
        const exp = decoded.exp ?? now
        const expiresIn = exp - now

        // If token is still valid > blacklist and deny refresh
        if (exp > now) {
            const blacklistKey = `bl_${token}`

            const isAlreadyBlacklisted = await redisClient.get(blacklistKey)

            if (!isAlreadyBlacklisted) {
                const ttl = expiresIn > 0 ? expiresIn : 60

                await redisClient.set(blacklistKey, "1", {
                    EX: ttl,
                })
            }

            throw new CustomError("Token is still valid. Action denied.", 403)
        }

        // Token is expired — allow refresh attempt
        req.user = decoded as JwtPayload
        return next()
    } catch (err) {
        if (err instanceof JsonWebTokenError)
            throw new CustomError("Tampered token", 401)
        throw err
    }
}
