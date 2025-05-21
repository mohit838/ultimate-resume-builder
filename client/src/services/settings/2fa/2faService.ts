import api from "@/api/axios"
import { endpoints } from "@/services/endpoints"

export interface TwoFASetup {
    qrCode: string
    secret: string
}

// Kick off 2FA: returns the QR and the base32 secret
export async function generate2FASetup(): Promise<TwoFASetup> {
    const { data } = await api.post(`${endpoints.auth.enable2fa}`)
    return data.model as TwoFASetup
}

// Verify the user’s code
export async function verify2FASetup(token: string): Promise<void> {
    await api.post(`${endpoints.auth.verify2fa}`, { token })
}
