import api from "@/api/axios"
import { endpoints } from "../endpoints"

export const requestForgotPasswordApi = async (email: string) => {
    const res = await api.post(`${endpoints.auth.requestForgotPassword}`, {
        email,
    })
    return res.data
}
