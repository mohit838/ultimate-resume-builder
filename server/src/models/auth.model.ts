export interface IUser {
    id: number
    name: string
    email: string
    password: string
    google_auth_enabled: boolean
    email_verified: boolean
    created_at: Date
    updated_at: Date
}

export interface ISignUp {
    name: string
    email: string
    password: string
}

export interface IOtpVerification {
    otp_code: number
    otp_expires_at: Date
}
