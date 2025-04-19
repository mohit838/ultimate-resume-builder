import api from "@/api/axios"
import { endpoints } from "../endpoints"

export interface LoginPayload {
    email: string
    password: string
}

export interface LoginResponse {
    model: {
        accessToken: string
        refreshToken: string
        id: string
        name: string
        email: string
        role: string
        emailVerified: boolean
        googleAuthEnabled: boolean
    }
}

export const loginApi = async (
    payload: LoginPayload
): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(
        `${endpoints.auth.login}`,
        payload
    )
    return data
}
