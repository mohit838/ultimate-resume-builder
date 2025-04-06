import redisClient from "@/config/redisClient"
import { CustomError } from "@/errors/CustomError"
import { successResponse } from "@/helper/ApiResponse"
import { createSignUpService, userLoginService } from "@/services/auth.service"
import {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "@/utils/jwt"
import { Request, Response } from "express"

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const newUser = await createSignUpService({
        name: username,
        email,
        password,
    })

    return successResponse(res, newUser, "User created successfully", 201)
}

export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const loginUser = await userLoginService({
        email,
        password,
    })

    return successResponse(res, loginUser, "User login successfully", 200)
}

export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.headers["x-refresh-token"]

    if (!refreshToken || typeof refreshToken !== "string") {
        throw new CustomError("Refresh token missing", 400)
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

    return successResponse(
        res,
        {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
        "Token refreshed",
        200
    )
}

export const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new CustomError("No token provided", 400)

    const token = authHeader.split(" ")[1]
    const decoded = verifyAccessToken(token)

    if (!decoded.exp) {
        throw new CustomError("Invalid token: missing expiration", 400)
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000) // seconds

    await redisClient.set(`bl_${token}`, "1", { EX: expiresIn })

    return successResponse(res, null, "Logged out successfully", 200)
}
