// Database level interface
export interface IUser {
    id: string // db internal
    nano_id: string // frontend/public identifier
    name: string
    email: string
    password: string
    role: string
    google_auth_secret?: string
    google_auth_enabled: boolean
    email_verified: boolean
    created_at: Date
    updated_at: Date
}

// Service  related interface
export interface ISignUp {
    name: string
    email: string
    password: string
}

export interface IOtpVerification {
    otp_code: number
    otp_expires_at: Date
}

export interface ILoginPayload {
    email: string
    password: string
}
