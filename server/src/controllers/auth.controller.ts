import { CustomError } from "@/errors/CustomError"
import { successResponse } from "@/helper/ApiResponse"
import {
    createSignUpService,
    generate2FAService,
    requestForResetPasswordService,
    requestOtpForForgotPasswordService,
    userAgainRequestOtpService,
    userLoginService,
    userLogOutService,
    userRefreshTokenService,
    userVerifyOtpService,
    verifyGoogle2FAService,
} from "@/services/auth.service"
import { Request, Response } from "express"

// 1. signup
export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const newUser = await createSignUpService({
        name: username,
        email,
        password,
    })

    return successResponse(res, newUser, "User created successfully", 201)
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

    const refreshTokenGenerate = await userRefreshTokenService(refreshToken)

    return successResponse(res, refreshTokenGenerate, "Token refreshed", 200)
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
        "OTP verified successfully",
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
        null,
        forgotRequestMsg?.message ?? "Reset OTP sent sucessfully",
        200
    )
}
