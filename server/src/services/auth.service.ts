import { CustomError } from "@/errors/CustomError"
import { ISignUp } from "@/models/auth.model"
import * as repo from "@/repositories/auth.repository"
import bcrypt from "bcrypt"

export const createSignUpService = async (data: ISignUp) => {
    // Check if user already exists
    const existingUser = await repo.findUserByEmail(data.email)
    if (existingUser) {
        throw new CustomError("Email already in use", 400)
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Save user
    const id = await repo.signUp({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })

    return {
        id,
        name: data.name,
        email: data.email,
    }
}
