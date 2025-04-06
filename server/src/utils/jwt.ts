import { SERVICE_SECURITIES } from "@/config/AppConstant"
import jwt from "jsonwebtoken"

export interface JwtPayload {
    id: string
    email: string
    iat?: number
    exp?: number
}

const jwtSecret = SERVICE_SECURITIES.jwt_secret || "default_secret"
const jwtRefreshSecret =
    SERVICE_SECURITIES.refresh_token_secret || "default_refresh_secret"

// Create Access Token (short-lived)
export const createAccessToken = (payload: JwtPayload): string =>
    jwt.sign(payload, jwtSecret, { expiresIn: "15m" })

// Create Refresh Token (longer lifespan)
export const createRefreshToken = (payload: JwtPayload): string =>
    jwt.sign(payload, jwtRefreshSecret, { expiresIn: "7d" })

// Verify Access Token
export const verifyAccessToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, jwtSecret)
    if (typeof decoded === "string") {
        throw new Error("Invalid token payload")
    }
    return decoded as JwtPayload
}

// Verify Refresh Token
export const verifyRefreshToken = (token: string): JwtPayload => {
    const decoded = jwt.verify(token, jwtRefreshSecret)
    if (typeof decoded === "string") {
        throw new Error("Invalid token payload")
    }
    return decoded as JwtPayload
}
