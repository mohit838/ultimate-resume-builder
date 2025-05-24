import bcrypt from "bcrypt"
import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import qrcode from "qrcode"
import speakeasy from "speakeasy"

import redisClient from "@/config/redisClient"
import { CustomError } from "@/errors/CustomError"
import { logLoginAttempt } from "@/logger/logLoginAttempt"
import { ILoginPayload, ISignUp } from "@/models/auth.model"
import * as repo from "@/repositories/auth.repository"
import {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "@/utils/jwt"
import { generateOTP } from "@/utils/otp"

import { sendOtpEmail } from "./otp.service"

// const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7 // 7 days in seconds
const REFRESH_TOKEN_TTL = 60 // 1 minute in seconds for testing

export const createSignUpService = async (data: ISignUp) => {
    // Prevent duplicate registrations
    const existingUser = await repo.findUserByEmail(data.email)
    if (existingUser) {
        throw new CustomError("Email already in use", 400)
    }

    // Generate and store OTP
    const otp = generateOTP()
    try {
        await redisClient.set(`otp_${data.email}`, otp, { EX: 600 }) // 10 minutes
    } catch {
        throw new CustomError("Failed to generate OTP", 500)
    }

    // Send OTP email
    const sent = await sendOtpEmail(data.email, otp)
    if (!sent) {
        throw new CustomError("Failed to send OTP email", 503)
    }

    // Create the user record
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const nanoId = await repo.signUp({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })
    if (!nanoId) {
        throw new CustomError("Error while creating user", 500)
    }

    // Return TTL for front-end countdown
    const ttl = await redisClient.ttl(`otp_${data.email}`)
    return {
        id: nanoId,
        name: data.name,
        email: data.email,
        message: "OTP sent to email. Please verify to complete registration.",
        ttl,
    }
}

export const userLoginService = async (data: ILoginPayload, req: Request) => {
    const user = await repo.findUserByEmail(data.email)
    const ip =
        req.ip ||
        (req.headers["x-forwarded-for"] as string) ||
        req.socket?.remoteAddress ||
        "unknown"
    const userAgent = req.headers["user-agent"] ?? "unknown"

    if (!user) {
        logLoginAttempt("unknown", "failed", ip, userAgent)
        throw new CustomError("User does not exist!", 400)
    }

    const match = await bcrypt.compare(data.password, user.password)
    if (!match) {
        logLoginAttempt(user.nano_id, "failed", ip, userAgent)
        throw new CustomError("Invalid credentials", 401)
    }

    logLoginAttempt(user.nano_id, "successful", ip, userAgent)

    const accessToken = createAccessToken({
        id: user.nano_id,
        email: user.email,
        role: user.role,
    })
    const refreshToken = createRefreshToken({
        id: user.nano_id,
        email: user.email,
        role: user.role,
    })

    // Persist refresh token
    await redisClient.set(`refresh_${user.nano_id}`, refreshToken, {
        EX: REFRESH_TOKEN_TTL,
    })

    return {
        accessToken,
        refreshToken,
        id: user.nano_id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: !!user.email_verified,
        googleAuthEnabled: !!user.google_auth_enabled,
    }
}

export const userRefreshTokenService = async (
    refreshToken: string | string[] | undefined,
    accessUser: JwtPayload
) => {
    if (!refreshToken || typeof refreshToken !== "string") {
        throw new CustomError("Refresh token missing or corrupted", 400)
    }

    const decoded = verifyRefreshToken(refreshToken)
    if (decoded.id !== accessUser.id || decoded.email !== accessUser.email) {
        throw new CustomError("Access/refresh token mismatch", 401)
    }

    const key = `refresh_${decoded.id}`
    const stored = await redisClient.get(key)
    if (stored && stored !== refreshToken) {
        throw new CustomError("Refresh token reuse detected", 401)
    }

    const newAccessToken = createAccessToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
    })
    const newRefreshToken = createRefreshToken({
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
    })

    await redisClient.set(key, newRefreshToken, { EX: REFRESH_TOKEN_TTL })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

export const userLogOutService = async (authHeader: string | undefined) => {
    if (!authHeader) {
        throw new CustomError("Authorization header missing", 400)
    }
    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("Malformed Authorization header", 400)
    }

    const token = authHeader.split(" ")[1]
    if (!token) {
        throw new CustomError("Access token is missing", 400)
    }

    let payload: JwtPayload
    try {
        payload = verifyAccessToken(token)
    } catch {
        throw new CustomError("Invalid or expired token", 401)
    }

    if (!payload.exp) {
        throw new CustomError("Invalid token: missing expiration", 400)
    }

    const ttl = payload.exp - Math.floor(Date.now() / 1000)
    await redisClient.set(`bl_${token}`, "1", { EX: ttl })

    return true
}

export const userVerifyOtpService = async ({
    email,
    otp,
}: {
    email: string
    otp: number
}) => {
    if (!email || typeof otp !== "number") {
        throw new CustomError("Email and numeric OTP required", 400)
    }

    const stored = await redisClient.get(`otp_${email}`)
    if (!stored) {
        throw new CustomError("OTP expired or not found", 400)
    }
    if (Number(stored) !== otp) {
        throw new CustomError("Invalid OTP", 401)
    }

    const user = await repo.findUserByEmail(email)
    if (!user) {
        throw new CustomError("User not found", 404)
    }

    await repo.markEmailVerified(email)
    await redisClient.del(`otp_${email}`)

    const accessToken = createAccessToken({
        id: user.nano_id,
        email: user.email,
        role: user.role,
    })
    const refreshToken = createRefreshToken({
        id: user.nano_id,
        email: user.email,
        role: user.role,
    })

    // Persist refresh token
    await redisClient.set(`refresh_${user.nano_id}`, refreshToken, {
        EX: REFRESH_TOKEN_TTL,
    })

    return {
        accessToken,
        refreshToken,
        id: user.nano_id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

export const userAgainRequestOtpService = async ({
    email,
}: {
    email: string
}) => {
    if (!email) {
        throw new CustomError("Email not provided", 400)
    }

    const user = await repo.findUserByEmail(email)
    if (!user) {
        throw new CustomError("User not found", 404)
    }
    if (user.email_verified) {
        throw new CustomError("Email already verified", 400)
    }

    const otp = generateOTP()
    await redisClient.set(`otp_${email}`, otp, { EX: 600 })
    const sent = await sendOtpEmail(email, otp)
    if (!sent) {
        throw new CustomError("Failed to send OTP email", 503)
    }

    const ttl = await redisClient.ttl(`otp_${email}`)
    return {
        message: "OTP sent to email. Please verify to continue.",
        ttl,
    }
}

export const requestOtpForForgotPasswordService = async (email: string) => {
    if (!email) {
        throw new CustomError("Email not provided", 400)
    }

    const user = await repo.findUserByEmail(email)
    if (!user) {
        throw new CustomError("User not found", 404)
    }

    // Mark email unverified to force OTP check
    if (user.email_verified) {
        await repo.markEmailNotVerified(email)
    }

    const otp = generateOTP()
    await redisClient.set(`otp_${email}`, otp, { EX: 600 })
    const sent = await sendOtpEmail(email, otp)
    if (!sent) {
        throw new CustomError("Failed to send OTP email", 503)
    }

    const ttl = await redisClient.ttl(`otp_${email}`)
    return {
        message: "OTP sent to email. Please verify to complete reset.",
        ttl,
    }
}

export const requestForResetPasswordService = async (
    email: string,
    password: string,
    confirmPassword: string
) => {
    if (!email || password !== confirmPassword) {
        throw new CustomError("Email and matching passwords required", 400)
    }

    const user = await repo.findUserByEmail(email)
    if (!user) {
        throw new CustomError("User not found", 404)
    }
    if (!user.email_verified) {
        throw new CustomError("OTP verification required before reset", 400)
    }

    const hashed = await bcrypt.hash(password, 10)
    await repo.setNewPasswordAfterReset(email, hashed)
    return true
}

export const getOtpTtlService = async (email: string) => {
    const ttl = await redisClient.ttl(`otp_${email}`)
    if (ttl < 0) {
        throw new CustomError("OTP not found or expired", 404)
    }
    return ttl
}

/**
 * Generates a new Google Authenticator secret for the given email,
 * persists it to the database, and returns both the QR‐code DataURL
 * (so the frontend can render the scan image) and the base32 secret
 * (so you can display or back it up if needed).
 */
export async function generate2FAService(
    email: string
): Promise<{ qrCode: string; secret: string }> {
    if (!email) throw new CustomError("Email is required to enable 2FA", 400)

    const secret = speakeasy.generateSecret({
        name: `Ultimate Resume (${email})`,
        length: 20,
    })
    if (!secret.otpauth_url) {
        throw new CustomError("Failed to generate 2FA secret", 500)
    }

    // Only save the secret—do NOT set the enabled flag yet
    await repo.saveGoogleAuthSecret(email, secret.base32)

    let qrCode: string
    try {
        qrCode = await qrcode.toDataURL(secret.otpauth_url)
    } catch (err) {
        throw new CustomError("Failed to generate QR code image", 500, err)
    }
    return { qrCode, secret: secret.base32 }
}

/**
 * Verifies a TOTP token against the stored secret for the given email.
 * Throws on any error; resolves silently on success.
 */
export async function verifyGoogle2FAService(
    email: string,
    token: string
): Promise<void> {
    if (!email || !token) {
        throw new CustomError("Email and 2FA token are required", 400)
    }

    const user = await repo.findUserByEmail(email)
    if (!user || !user.google_auth_secret) {
        throw new CustomError("2FA is not set up for this user", 400)
    }

    const isValid = speakeasy.totp.verify({
        secret: user.google_auth_secret,
        encoding: "base32",
        token,
        window: 1,
    })
    if (!isValid) {
        throw new CustomError("Invalid 2FA token", 401)
    }

    // mark 2FA as enabled
    await repo.enableGoogleAuth(email)
}

export const disable2FAService = async (email: string): Promise<void> => {
    if (!email) {
        throw new CustomError("Email is required to disable 2FA", 400)
    }

    const enabled = await repo.isTwoFAEnabled(email)
    if (!enabled) {
        throw new CustomError("2FA is not enabled for this user", 400)
    }

    await repo.disableTwoFA(email)
}
