import { Request, Response } from "express"

import { CustomError } from "@/errors/CustomError"
import { successResponse } from "@/helper/ApiResponse"
import logger from "@/logger/logger"
import {
    createSignUpService,
    disable2FAService,
    generate2FAService,
    getOtpTtlService,
    requestForResetPasswordService,
    requestOtpForForgotPasswordService,
    userAgainRequestOtpService,
    userLoginService,
    userLogOutService,
    userRefreshTokenService,
    userVerifyOtpService,
    verifyGoogle2FAService,
} from "@/services/auth.service"
import { JwtPayload } from "@/utils/jwt"

// 1. Signup
export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body
        const newUser = await createSignUpService({
            name: username,
            email,
            password,
        })
        return successResponse(res, newUser, "OTP sent; please verify", 200)
    } catch (err) {
        logger.error("signUp error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 2. Login
export const logIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const loginUser = await userLoginService({ email, password }, req)
        return successResponse(res, loginUser, "User logged in", 200)
    } catch (err) {
        logger.error("logIn error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 3. Refresh token
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshTokenHeader = req.headers["x-refresh-token"]
        const accessUser = req.user as JwtPayload
        const tokenSet = await userRefreshTokenService(
            refreshTokenHeader,
            accessUser
        )

        // Use successResponse for consistency
        return successResponse(
            res,
            {
                ...tokenSet,
                user: {
                    id: accessUser.id,
                    email: accessUser.email,
                    role: accessUser.role,
                },
            },
            "Token refreshed",
            200
        )
    } catch (err) {
        logger.error("refreshToken error", {
            user: req.user,
            err,
        })
        throw err
    }
}

// 4. Logout
export const logout = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization
        const result = await userLogOutService(authHeader)
        return successResponse(
            res,
            null,
            result ? "Logged out successfully" : "Logout failed",
            200
        )
    } catch (err) {
        logger.error("logout error", {
            user: req.user,
            err,
        })
        throw err
    }
}

// 5. Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body
        const payload = await userVerifyOtpService({ email, otp })
        return successResponse(res, payload, "OTP verified", 200)
    } catch (err) {
        logger.error("verifyOtp error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 6. Resend OTP
export const requestOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const payload = await userAgainRequestOtpService({ email })
        return successResponse(res, payload, payload?.message, 200)
    } catch (err) {
        logger.error("requestOtp error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 7. Role‐test endpoint
export const testRoleBase = async (req: Request, res: Response) => {
    return successResponse(res, null, "Role test successful!", 200)
}

// 8. Generate Google 2FA QR
export const generate2FA = async (req: Request, res: Response) => {
    try {
        const email = req.user?.email
        if (!email) throw new CustomError("User not found", 400)
        const { qrCode, secret } = await generate2FAService(email)
        return successResponse(
            res,
            { qrCode, secret },
            "Scan QR to enable 2FA",
            200
        )
    } catch (err) {
        logger.error("generate2FA error", {
            user: req.user,
            err,
        })
        throw err
    }
}

// 9. Verify Google 2FA token
export const verifyGoogle2FA = async (req: Request, res: Response) => {
    try {
        const { token } = req.body
        const email = req.user?.email
        if (!email || !token) {
            throw new CustomError("Email and token are required", 400)
        }
        await verifyGoogle2FAService(email, token)
        return successResponse(res, null, "2FA verified", 200)
    } catch (err) {
        logger.error("verifyGoogle2FA error", {
            user: req.user,
            err,
        })
        throw err
    }
}

// 10. Reset password
export const requestResetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword } = req.body
        if (!email || password !== confirmPassword) {
            throw new CustomError("Email and matching passwords required", 400)
        }
        await requestForResetPasswordService(email, password, confirmPassword)
        return successResponse(res, null, "Password reset successful", 200)
    } catch (err) {
        logger.error("requestResetPassword error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 11. Forgot password (send OTP)
export const requestOtpForForgotPassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = req.body
        if (!email) {
            throw new CustomError("Email is required", 400)
        }
        const payload = await requestOtpForForgotPasswordService(email)
        return successResponse(res, payload, payload?.message, 200)
    } catch (err) {
        logger.error("requestOtpForForgotPassword error", {
            email: req.body.email,
            err,
        })
        throw err
    }
}

// 12. Get OTP TTL
export const getOtpTtl = async (req: Request, res: Response) => {
    try {
        const email = req.query.email as string
        if (!email) {
            throw new CustomError("Email query parameter is required", 400)
        }

        const ttl = await getOtpTtlService(email)

        if (ttl > 0) {
            return successResponse(res, { ttl }, "OTP is valid", 200)
        }

        const message = ttl === 0 ? "OTP expired" : "OTP not found"
        return successResponse(res, null, message, 200)
    } catch (err) {
        logger.error("getOtpTtl error", {
            email: req.query.email,
            err,
        })
        throw err
    }
}

// 13. Disable Google 2FA
export const disable2FA = async (req: Request, res: Response): Promise<any> => {
    try {
        const email = req.user?.email
        if (!email) {
            throw new CustomError("Unauthorized: no email present", 401)
        }

        await disable2FAService(email)
        return successResponse(res, null, "2FA disabled", 200)
    } catch (err) {
        logger.error("disable2FA error", { user: req.user, err })
        throw err
    }
}
