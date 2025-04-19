import api from "@/api/axios"
import { endpoints } from "../endpoints"

export interface ResetPasswordPayload {
    email: string
    password: string
    confirmPassword: string
}

export const resetPasswordApi = async (data: ResetPasswordPayload) => {
    const response = await api.post(`${endpoints.auth.resetPassword}`, data)
    return response.data
}
