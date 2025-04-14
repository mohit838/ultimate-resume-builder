import { useNotification } from "@/hooks/useNotification"
import { requestForgotPasswordApi } from "@/services/auth/requestForgotPassword"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

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
