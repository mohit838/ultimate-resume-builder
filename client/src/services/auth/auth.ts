import api from "@/api/axios"
import { endpoints } from "../endpoints"

export interface LoginPayload {
    email: string
    password: string
}

export interface ResetPasswordPayload {
    email: string
    password: string
    confirmPassword: string
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

export const verifyOtpApi = async (data: { email: string; otp: number }) => {
    const res = await api.post(`${endpoints.auth.verifyOtp}`, data)
    return res.data
}

export const resendOtpApi = async (data: { email: string }) => {
    const res = await api.post(`${endpoints.auth.resendOtp}`, data)
    return res.data
}

export const requestForgotPasswordApi = async (email: string) => {
    const res = await api.post(`${endpoints.auth.requestForgotPassword}`, {
        email,
    })
    return res.data
}

export const resetPasswordApi = async (data: ResetPasswordPayload) => {
    const response = await api.post(`${endpoints.auth.resetPassword}`, data)
    return response.data
}
