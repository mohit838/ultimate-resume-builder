import { CustomError } from "@/errors/CustomError"
import { ILogin, ISignUp } from "@/models/auth.model"
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

export const userLoginService = async (data: ILogin) => {
    const existingUser = await repo.findUserByEmail(data.email)

    if (!existingUser) {
        throw new CustomError("User does not exist!", 400)
    }

    const isPasswordMatch = await bcrypt.compare(
        data.password,
        existingUser.password
    )

    if (!isPasswordMatch) {
        throw new CustomError("Invalid credentials", 401)
    }

    return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        emailVerified: !!existingUser.email_verified,
        googleAuthEnabled: !!existingUser.google_auth_enabled,
    }
}
