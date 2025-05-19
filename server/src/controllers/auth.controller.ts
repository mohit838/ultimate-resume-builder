import { CustomError } from "@/errors/CustomError"
import { successResponse } from "@/helper/ApiResponse"
import {
    createSignUpService,
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
import { Request, Response } from "express"

// 1. signup
export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const newUser = await createSignUpService({
        name: username,
        email,
        password,
    })

    return successResponse(res, newUser, "Need to verify OTP", 200)
}

// 2. login
export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const loginUser = await userLoginService({ email, password }, req)

    return successResponse(res, loginUser, "User login successfully", 200)
}

// 3. refresh token generations
export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.headers["x-refresh-token"]
    const accessUser = req.user as JwtPayload

    const tokenSet = await userRefreshTokenService(refreshToken, accessUser)

    console.log(tokenSet)

    return res.status(200).json({
        success: true,
        message: "Token refreshed",
        model: {
            ...tokenSet,
            user: {
                id: accessUser.id,
                email: accessUser.email,
                role: accessUser.role,
            },
        },
    })
}

// 4. logout
export const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization

    const logoutUser = await userLogOutService(authHeader)

    return successResponse(
        res,
        null,
        logoutUser ? "Logged out successfully" : "Facing issues!!",
        200
    )
}

// 5. otp verifications
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body

    const getLoginInfoAfterVerify = await userVerifyOtpService({ email, otp })

    return successResponse(
        res,
        getLoginInfoAfterVerify,
        "OTP verified successfully",
        200
    )
}

// 6. request otp
export const requestOtp = async (req: Request, res: Response) => {
    const { email } = req.body

    const getLoginInfoAfterVerify = await userAgainRequestOtpService({ email })

    return successResponse(
        res,
        getLoginInfoAfterVerify,
        getLoginInfoAfterVerify?.message,
        200
    )
}

// 7. test role base auth
export const testRoleBase = async (req: Request, res: Response) => {
    return successResponse(res, null, "Role test successfull!", 200)
}

// 8. 2FA - Generate
export const generate2FA = async (req: Request, res: Response) => {
    const userEmail = req?.user?.email
    if (!userEmail) throw new CustomError("User does not exist!", 400)

    const qrCodeDataUrl = await generate2FAService(userEmail)

    return successResponse(
        res,
        { qrCode: qrCodeDataUrl },
        "Scan QR to enable 2FA"
    )
}

// 9. 2FA - Verify
export const verifyGoogle2FA = async (req: Request, res: Response) => {
    const { token } = req.body
    const email = req?.user?.email

    if (!email || !token) {
        throw new CustomError("Email and token are required", 400)
    }

    await verifyGoogle2FAService(email, token)

    return successResponse(res, null, "2FA verification successful", 200)
}

// 10. Reset password request
export const requestResetPassword = async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body

    if (!email || password !== confirmPassword) {
        throw new CustomError("Email and password are required", 400)
    }

    await requestForResetPasswordService(email, password, confirmPassword)

    return successResponse(res, null, "Reset password sucessfully", 200)
}

// 11. Forgot password request
export const requestOtpForForgotPassword = async (
    req: Request,
    res: Response
) => {
    const { email } = req.body

    if (!email) {
        throw new CustomError("Email is required", 400)
    }

    const forgotRequestMsg = await requestOtpForForgotPasswordService(email)

    return successResponse(
        res,
        forgotRequestMsg,
        forgotRequestMsg?.message,
        200
    )
}

// 12. ttl for otp
export const getOtpTtl = async (req: Request, res: Response) => {
    const { email } = req.query

    if (typeof email !== "string") {
        throw new CustomError("Invalid email format", 400)
    }

    const ttl = await getOtpTtlService(email)

    if (!ttl) {
        throw new CustomError("OTP TTL not found", 404)
    }
    if (ttl === 0) {
        return successResponse(res, null, "OTP expired")
    }
    if (ttl < 0) {
        return successResponse(res, null, "OTP not found")
    }
    if (ttl > 0) {
        return successResponse(res, null, "OTP is valid")
    }
    // If ttl is found and greater than 0, return the ttl
    return successResponse(res, { ttl }, "Fetched OTP TTL")
}
