import { loginApi, signupApi } from "@/services/auth/loginAndSignup"
import useAuthStore from "@/stores/useAuthStore"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNotification } from "./useNotification"

export const useLogIn = () => {
    const { error } = useNotification()
    const { login } = useAuthStore()

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (response) => {
            const {
                accessToken,
                refreshToken,
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            } = response.model

            localStorage.setItem("refresh_token", refreshToken)

            login(accessToken, {
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            })
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
