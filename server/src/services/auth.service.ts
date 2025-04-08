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
import bcrypt from "bcrypt"
import { Request } from "express"
import { sendOtpEmail } from "./otp.service"

export const createSignUpService = async (data: ISignUp) => {
    const existingUser = await repo.findUserByEmail(data.email)
    if (existingUser) {
        throw new CustomError("Email already in use", 400)
    }

    const otp = generateOTP()

    await redisClient.set(`otp_${data.email}`, otp, { EX: 180 }) // 3 mins

    // Send OTP to email
    const sendEmailSuccessfully = await sendOtpEmail(data.email, otp)

    if (sendEmailSuccessfully) {
        const hashedPassword = await bcrypt.hash(data.password, 10)

        const nanoId = await repo.signUp({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        })
        return {
            id: nanoId,
            name: data.name,
            email: data.email,
            message:
                "OTP sent to email. Please verify to complete registration.",
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
    })
    const refreshToken = createRefreshToken({
        id: user.nano_id,
        email: user.email,
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
    refreshToken: string | string[] | undefined
) => {
    if (!refreshToken || typeof refreshToken !== "string") {
        throw new CustomError("Refresh token missing or corrupted", 400)
    }

    const decoded = verifyRefreshToken(refreshToken)

    // create new tokens
    const newAccessToken = createAccessToken({
        id: decoded.id,
        email: decoded.email,
    })
    const newRefreshToken = createRefreshToken({
        id: decoded.id,
        email: decoded.email,
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

export const userLogOutService = async (authHeader: string | undefined) => {
    if (!authHeader) throw new CustomError("No token provided", 400)

    if (typeof authHeader !== "string")
        throw new CustomError("Token corrupted", 400)

    const token = authHeader.split(" ")[1]
    const decoded = verifyAccessToken(token)

    if (!decoded.exp) {
        throw new CustomError("Invalid token: missing expiration", 400)
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000) // seconds

    const blacklistToken = await redisClient.set(`bl_${token}`, "1", {
        EX: expiresIn,
    })

    return blacklistToken ? true : false
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
    })
    const refreshToken = createRefreshToken({
        id: user.nano_id,
        email: user.email,
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
        const otp = generateOTP()

        await redisClient.set(`otp_${existingUser.email}`, otp, { EX: 180 }) // 3 mins

        // Send OTP to email
        const sendEmailSuccessfully = await sendOtpEmail(
            existingUser.email,
            otp
        )

        if (sendEmailSuccessfully) {
            return {
                message:
                    "OTP sent to email. Please verify to complete registration.",
            }
        }
    } else {
        throw new CustomError("Cant send otp to your mail!")
    }
}
