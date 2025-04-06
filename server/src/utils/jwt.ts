import { SERVICE_SECURITIES } from "@/config/AppConstant"
import jwt from "jsonwebtoken"

const jwtSecret = SERVICE_SECURITIES.jwt_secret || "default_secret"
const jwtRefreshSecret =
    SERVICE_SECURITIES.refresh_token_secret || "default_refresh_secret"

export const createAccessToken = (payload: object) =>
    jwt.sign(payload, jwtSecret, { expiresIn: "15m" })

export const createRefreshToken = (payload: object) =>
    jwt.sign(payload, jwtRefreshSecret, { expiresIn: "7d" })

export const verifyAccessToken = (token: string) => jwt.verify(token, jwtSecret)

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, jwtRefreshSecret)
