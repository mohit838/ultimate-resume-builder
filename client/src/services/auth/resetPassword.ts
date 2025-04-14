import api from "@/api/lib/axios"

export interface ResetPasswordPayload {
    email: string
    password: string
    confirmPassword: string
}

export const resetPasswordApi = async (data: ResetPasswordPayload) => {
    const response = await api.post("auth/reset-password", data)
    return response.data
}
