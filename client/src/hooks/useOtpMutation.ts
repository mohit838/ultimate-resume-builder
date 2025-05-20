import { useNotification } from "@/hooks/useNotification"
import { resendOtpApi, verifyOtpApi } from "@/services/auth/otp"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useVerifyOtp = (email: string) => {
    const { success, error } = useNotification()

    return useMutation({
        mutationFn: (otp: string) => {
            const parsedOtp = Number(otp)
            if (isNaN(parsedOtp)) {
                throw new Error("Invalid OTP format")
            }
            return verifyOtpApi({ email, otp: parsedOtp })
        },
        onSuccess: () => {
            success("OTP verified!")
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
