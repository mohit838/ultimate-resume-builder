import api from "@/api/axios"
import { endpoints } from "../endpoints"

export const verifyOtpApi = async (data: { email: string; otp: number }) => {
    const res = await api.post(`${endpoints.auth.verifyOtp}`, data)
    return res.data
}

export const resendOtpApi = async (data: { email: string }) => {
    const res = await api.post(`${endpoints.auth.resendOtp}`, data)
    return res.data
}
