import Database from "@/config/dbConfig"
import { ISignUp, IUser } from "@/models/auth.model"
import { nanoid } from "@/utils/nanoIdGenerate"
import { ResultSetHeader, RowDataPacket } from "mysql2"

interface UserRow extends IUser, RowDataPacket {
    role: string
}

export const signUp = async (input: ISignUp): Promise<string> => {
    const nanoId = nanoid()
    const roleId = 1001 // Default to user

    const db = await Database.getInstance()

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (nano_id, name, email, password, role_id) VALUES (?, ?, ?, ?, ?)",
        [nanoId, input.name, input.email, input.password, roleId]
    )

    if (result.affectedRows === 0) {
        throw new Error("User could not be created.")
    }

    return nanoId
}

export const findUserByEmail = async (
    email: string
): Promise<UserRow | null> => {
    const db = await Database.getInstance()

    const [rows] = await db.execute<UserRow[]>(
        `SELECT u.*, r.name as role 
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.email = ?`,
        [email]
    )

    return rows.length ? rows[0] : null
}

export const markEmailVerified = async (email: string) => {
    const db = await Database.getInstance()
    await db.execute("UPDATE users SET email_verified = true WHERE email = ?", [
        email,
    ])
}

export const markEmailNotVerified = async (email: string) => {
    const db = await Database.getInstance()
    await db.execute(
        "UPDATE users SET email_verified = false WHERE email = ?",
        [email]
    )
}

export const saveGoogleAuthSecret = async (
    email: string,
    secret: string
): Promise<void> => {
    const db = await Database.getInstance()
    await db.execute(
        "UPDATE users SET google_auth_secret = ?, google_auth_enabled = true WHERE email = ?",
        [secret, email]
    )
}

export const setNewPasswordAfterReset = async (
    email: string,
    hashedPassword: string
) => {
    const db = await Database.getInstance()
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
    ])
}
