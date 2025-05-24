import { loginApi, signupApi } from "@/services/auth/loginAndSignup"
import useAuthStore from "@/stores/useAuthStore"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useNotification } from "./useNotification"

export const useLogIn = () => {
    const { success, error } = useNotification()
    const { login } = useAuthStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data) => {
            const {
                accessToken,
                refreshToken,
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            } = data.model

            localStorage.setItem("refresh_token", refreshToken)

            login(accessToken, {
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            })

            success("Login successful!")

            if (googleAuthEnabled) {
                navigate("/verify-2fa-login", { replace: true })
            } else {
                navigate("/dashboard", { replace: true })
            }
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            error(err?.response?.data?.message || "Login failed")
        },
    })
}

export const useSignup = () => {
    const { error } = useNotification()

    return useMutation({
        mutationFn: signupApi,
        onError: (err: AxiosError<{ message?: string }>) => {
            // Handle error during signup
            error(err?.response?.data?.message || "Signup failed")
        },
    })
}
