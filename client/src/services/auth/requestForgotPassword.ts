import api from "@/api/lib/axios"

export const requestForgotPasswordApi = async (email: string) => {
    const res = await api.post("auth/forgot-password", { email })
    return res.data
}
