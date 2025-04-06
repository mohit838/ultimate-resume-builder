import Database from "@/config/dbConfig"
import { ISignUp } from "@/models/auth.model"
import { ResultSetHeader, RowDataPacket } from "mysql2"

interface UserRow extends RowDataPacket {
    id: number
    name: string
    email: string
    password: string
    google_auth_enabled: number
    email_verified: number
    otp_code: string | null
    otp_expires_at: Date | null
    created_at: Date
    updated_at: Date
}

export const signUp = async (input: ISignUp): Promise<number> => {
    const db = await Database.getInstance()

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [input.name, input.email, input.password]
    )

    return result.insertId
}

export const findUserByEmail = async (
    email: string
): Promise<UserRow | null> => {
    const db = await Database.getInstance()

    const [rows] = await db.execute<UserRow[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    return rows.length ? rows[0] : null
}
