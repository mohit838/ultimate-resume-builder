import { CustomError } from "@/errors/CustomError"
import { ILogin, ISignUp } from "@/models/auth.model"
import * as repo from "@/repositories/auth.repository"
import { createAccessToken, createRefreshToken } from "@/utils/jwt"
import bcrypt from "bcrypt"

export const createSignUpService = async (data: ISignUp) => {
    const existingUser = await repo.findUserByEmail(data.email)
    if (existingUser) {
        throw new CustomError("Email already in use", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const nanoId = await repo.signUp({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    })

    const accessToken = createAccessToken({ id: nanoId, email: data.email })
    const refreshToken = createRefreshToken({ id: nanoId, email: data.email })

    return {
        accessToken,
        refreshToken,
        id: nanoId,
        name: data.name,
        email: data.email,
    }
}

export const userLoginService = async (data: ILogin) => {
    const user = await repo.findUserByEmail(data.email)

    if (!user) {
        throw new CustomError("User does not exist!", 400)
    }

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) {
        throw new CustomError("Invalid credentials", 401)
    }

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
        emailVerified: !!user.email_verified,
        googleAuthEnabled: !!user.google_auth_enabled,
    }
}
