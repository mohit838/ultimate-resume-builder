import { successResponse } from "@/helper/ApiResponse"
import { createSignUpService } from "@/services/auth.service"
import { Request, Response } from "express"

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const newUser = await createSignUpService({
        name: username,
        email,
        password,
    })

    return successResponse(res, newUser, "User created", 201)
}
