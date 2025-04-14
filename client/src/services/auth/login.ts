import api from "@/api/lib/axios"

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
    const { data } = await api.post<LoginResponse>("auth/login", payload)
    return data
}
