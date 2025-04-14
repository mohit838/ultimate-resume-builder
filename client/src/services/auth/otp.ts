import api from "@/api/lib/axios"

export const verifyOtpApi = async (data: { email: string; otp: number }) => {
    //TODO:: For now treat as request otp later change to verify otp or request otp
    const res = await api.post("auth/verify-otp", data)
    return res.data
}

export const resendOtpApi = async (data: { email: string }) => {
    const res = await api.post("auth/resend-otp", data)
    return res.data
}
