import redisClient from "@/config/redisClient"
import { CustomError } from "@/errors/CustomError"
import { logLoginAttempt } from "@/logger/logLoginAttempt"
import { ILoginPayload, ISignUp } from "@/models/auth.model"
import * as repo from "@/repositories/auth.repository"
import {
    createAccessToken,
    createRefreshToken,
    JwtPayload,
    verifyAccessToken,
    verifyRefreshToken,
} from "@/utils/jwt"
import { generateOTP } from "@/utils/otp"
import bcrypt from "bcrypt"
import { Request } from "express"
import qrcode from "qrcode"
import speakeasy from "speakeasy"
import { sendOtpEmail } from "./otp.service"

export const createSignUpService = async (data: ISignUp) => {
    const existingUser = await repo.findUserByEmail(data.email)
    if (existingUser) {
        throw new CustomError("Email already in use", 400)
    }

    const otp = generateOTP()

    await redisClient.set(`otp_${data.email}`, otp, { EX: 600 }) // 10 mins

    // Send OTP to email
    const sendEmailSuccessfully = await sendOtpEmail(data.email, otp)

    if (sendEmailSuccessfully) {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const nanoId = await repo.signUp({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        })

        const ttl = await redisClient.ttl(`otp_${data.email}`)

        if (!nanoId) {
            throw new CustomError("Error while creating user!", 500)
        }

        return {
            id: nanoId,
            name: data.name,
            email: data.email,
            message:
                "OTP sent to email. Please verify to complete registration.",
            ttl,
        }
    } else {
        throw new CustomError("Cant send otp to your mail!")
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

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) {
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

    const refreshDecoded = verifyRefreshToken(refreshToken)

    if (
        refreshDecoded.id !== accessUser.id ||
        refreshDecoded.email !== accessUser.email
    ) {
        throw new CustomError("Access/refresh token mismatch", 401)
    }

    const redisKey = `refresh_${refreshDecoded.id}`
    const storedToken = await redisClient.get(redisKey)

    if (storedToken && storedToken !== refreshToken) {
        throw new CustomError("Refresh token reuse detected", 401)
    }

    const newAccessToken = createAccessToken({
        id: refreshDecoded.id,
        email: refreshDecoded.email,
        role: refreshDecoded.role,
    })

    const newRefreshToken = createRefreshToken({
        id: refreshDecoded.id,
        email: refreshDecoded.email,
        role: refreshDecoded.role,
    })

    await redisClient.set(redisKey, newRefreshToken, {
        EX: 60 * 60 * 24 * 7, // 7 days
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

export const userLogOutService = async (authHeader: string | undefined) => {
    if (!authHeader) {
        throw new CustomError("No token provided", 400)
    }

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("Malformed Authorization header", 400)
    }

    const token = authHeader.split(" ")[1]
    if (!token || token.length < 10) {
        throw new CustomError("Access token is missing or invalid", 400)
    }

    let decoded: JwtPayload
    try {
        decoded = verifyAccessToken(token)
    } catch (err) {
        console.error("Token decode failed:", err)
        throw new CustomError("Invalid or expired token", 401)
    }

    if (!decoded.exp) {
        throw new CustomError("Invalid token: missing expiration", 400)
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
    const blacklistToken = await redisClient.set(`bl_${token}`, "1", {
        EX: expiresIn,
    })

    return !!blacklistToken
}

export const userVerifyOtpService = async ({
    email,
    otp,
}: {
    email: string
    otp: number
}) => {
    if (!email || !otp) {
        throw new CustomError("Email and OTP required", 400)
    }

    const storedOtp = await redisClient.get(`otp_${email}`)

    if (!storedOtp) {
        throw new CustomError("OTP expired or not found", 400)
    }

    if (Number(storedOtp) !== otp) {
        throw new CustomError("Invalid OTP", 401)
    }

    // Find user
    const user = await repo.findUserByEmail(email)
    if (!user) {
        throw new CustomError("User not found", 404)
    }

    // Mark verified
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
        throw new CustomError("Email not found!", 404)
    }

    const existingUser = await repo.findUserByEmail(email)

    if (existingUser) {
        // if user already verified
        if (existingUser.email_verified) {
            throw new CustomError("Email already verified!", 401)
        }

        const otp = generateOTP()

        await redisClient.set(`otp_${existingUser.email}`, otp, { EX: 600 }) // 10 mins

        // Send OTP to email
        const sendEmailSuccessfully = await sendOtpEmail(
            existingUser.email,
            otp
        )

        const ttl = await redisClient.ttl(`otp_${email}`)

        if (sendEmailSuccessfully) {
            return {
                message:
                    "OTP sent to email. Please verify for further process.",
                ttl,
            }
        }
    } else {
        throw new CustomError("Cant send otp to your mail!")
    }
}

export const generate2FAService = async (
    email: string
): Promise<{ qrCode: string; secret: string }> => {
    // 0.0 Promise<string>
    const secret = speakeasy.generateSecret({
        name: `Ultimate Resume (${email})`,
    })

    if (!secret.otpauth_url) {
        throw new CustomError("Failed to generate QR code", 500)
    }

    await repo.saveGoogleAuthSecret(email, secret.base32)

    // 0.1 return await qrcode.toDataURL(secret.otpauth_url)
    return {
        qrCode: await qrcode.toDataURL(secret.otpauth_url),
        secret: secret.base32,
    }
}

export const verifyGoogle2FAService = async (email: string, token: string) => {
    const user = await repo.findUserByEmail(email)
    if (!user || !user.google_auth_secret) {
        throw new CustomError("2FA not set up", 400)
    }

    const isValid = speakeasy.totp.verify({
        secret: user.google_auth_secret,
        encoding: "base32",
        token,
        window: 1,
    })

    if (!isValid) {
        throw new CustomError("Invalid 2FA code", 401)
    }

    return true
}

export const requestOtpForForgotPasswordService = async (email: string) => {
    if (!email) {
        throw new CustomError("Email not found!", 404)
    }

    const existingUser = await repo.findUserByEmail(email)

    if (existingUser) {
        // if user already verified then mark unverified if call this service
        if (existingUser.email_verified) {
            // Mark as unverified
            await repo.markEmailNotVerified(email)
        }

        const otp = generateOTP()

        await redisClient.set(`otp_${existingUser.email}`, otp, { EX: 600 }) // 10 mins

        // Send OTP to email
        const sendEmailSuccessfully = await sendOtpEmail(
            existingUser.email,
            otp
        )

        const ttl = await redisClient.ttl(`otp_${email}`)

        if (sendEmailSuccessfully) {
            return {
                message:
                    "OTP sent to email. Please verify to complete registration.",
                ttl,
            }
        }
    } else {
        throw new CustomError("Cant send otp to your mail!")
    }
}

export const requestForResetPasswordService = async (
    email: string,
    password: string,
    confirmPassword: string
) => {
    if (!email || password !== confirmPassword) {
        // Use decoy message for hacking protections
        throw new CustomError("Email or password not found!", 404)
    }

    const existingUser = await repo.findUserByEmail(email)

    if (existingUser) {
        if (existingUser.email_verified) {
            const hashedPassword = await bcrypt.hash(password, 10)

            await repo.setNewPasswordAfterReset(email, hashedPassword)

            return true
        }
    } else {
        throw new CustomError("Error while resetting password!")
    }
}

export const getOtpTtlService = async (email: string) => {
    const ttl = await redisClient.ttl(`otp_${email}`)
    if (ttl === -2) {
        throw new CustomError("OTP not found or expired", 404)
    }
    return ttl
}
