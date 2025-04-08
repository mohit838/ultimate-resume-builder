import { successResponse } from "@/helper/ApiResponse"
import {
    createSignUpService,
    userAgainRequestOtpService,
    userLoginService,
    userLogOutService,
    userRefreshTokenService,
    userVerifyOtpService,
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
