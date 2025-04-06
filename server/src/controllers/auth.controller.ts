import { successResponse } from "@/helper/ApiResponse"
import { createSignUpService, userLoginService } from "@/services/auth.service"
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
