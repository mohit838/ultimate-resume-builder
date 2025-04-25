import {
    requestForgotPasswordApi,
    resendOtpApi,
    resetPasswordApi,
    ResetPasswordPayload,
    verifyOtpApi,
} from "@/services/auth/auth"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useNotification } from "./useNotification"

export const useForgotPasswordMutation = () => {
    const notify = useNotification()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: requestForgotPasswordApi,
        onSuccess: (_, email) => {
            notify.success("OTP sent to your email!")
            localStorage.setItem("email_forgot", email)
            navigate("/verify-otp")
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            notify.error(error?.response?.data?.message || "Failed to send OTP")
        },
    })
}

export const useVerifyOtp = (email: string) => {
    const { success, error } = useNotification()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (otp: string) => {
            const parsedOtp = Number(otp)
            if (isNaN(parsedOtp)) {
                throw new Error("Invalid OTP format")
            }
            return verifyOtpApi({ email, otp: parsedOtp })
        },
        onSuccess: () => {
            success("OTP verified! Proceed to reset password.")
            localStorage.setItem("otp_verified", "true")
            navigate("/reset-password")
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            error(err?.response?.data?.message || "Invalid OTP or expired.")
        },
    })
}

export const useResendOtp = (email: string) => {
    const { success, error } = useNotification()

    return useMutation({
        mutationFn: () => resendOtpApi({ email }),
        onSuccess: () => success("OTP sent again to your email."),
        onError: (err: AxiosError<{ message?: string }>) => {
            error(err?.response?.data?.message || "Failed to resend OTP.")
        },
    })
}

export const useResetPasswordMutation = () => {
    const notify = useNotification()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: (payload: ResetPasswordPayload) =>
            resetPasswordApi(payload),
        onSuccess: () => {
            localStorage.removeItem("refresh_token")
            localStorage.removeItem("auth-storage")
            localStorage.removeItem("email_forgot")
            notify.success("Password reset successfully!")
            navigate("/login")
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            notify.error(
                err?.response?.data?.message || "Failed to reset password"
            )
        },
    })
}
