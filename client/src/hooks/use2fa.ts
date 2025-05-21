import {
    disable2FASetup,
    generate2FASetup,
    verify2FASetup,
} from "@/services/settings/2fa/2faService"
import useAuthStore from "@/stores/useAuthStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useNotification } from "./useNotification"

export function useGenerate2FA() {
    const notify = useNotification()

    return useMutation({
        mutationKey: ["generate2FA"],
        mutationFn: () => generate2FASetup(),
        onSuccess: (data) => {
            notify.success("2FA setup generated successfully!")
            return data
        },
        onError: (err: AxiosError) => {
            notify.error(
                (err.response?.data as { message?: string }).message ||
                    "Failed to generate 2FA setup"
            )
        },
    })
}

export function useVerify2FA() {
    const notify = useNotification()
    const login = useAuthStore((s) => s.login)
    const user = useAuthStore((s) => s.user)
    const token = useAuthStore((s) => s.token)!
    const navigate = useNavigate()

    return useMutation({
        mutationKey: ["verify2FA"],
        mutationFn: (code: string) => verify2FASetup(code),
        onSuccess: () => {
            notify.success("Two-factor authentication enabled!")
            if (user) login(token, { ...user, googleAuthEnabled: true })
            navigate("/dashboard", { replace: true })
        },
        onError: (err: AxiosError) => {
            notify.error(
                (err?.response?.data as { message?: string }).message ||
                    "Invalid 2FA code"
            )
        },
    })
}

export function useDisable2FA() {
    const notify = useNotification()
    const login = useAuthStore((s) => s.login)
    const user = useAuthStore((s) => s.user)!
    const token = useAuthStore((s) => s.token)!
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    return useMutation<void, AxiosError>({
        mutationKey: ["disable2FA"],
        mutationFn: disable2FASetup,
        onSuccess: () => {
            notify.success("Two-factor authentication disabled.")
            login(token, { ...user, googleAuthEnabled: false })
            queryClient.invalidateQueries({ queryKey: ["generate2FA"] })
            navigate("/settings/enable-2fa", { replace: true })
        },
        onError: (err: AxiosError) => {
            notify.error(
                (err.response?.data as { message?: string })?.message ||
                    "Failed to disable 2FA"
            )
        },
    })
}
