import { useNotification } from "@/hooks/useNotification"
import {
    resetPasswordApi,
    ResetPasswordPayload,
} from "@/services/auth/resetPassword"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

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
