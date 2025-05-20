import Database from "@/config/dbConfig"
import { CustomError } from "@/errors/CustomError"
import { ISignUp, IUser } from "@/models/auth.model"
import { nanoid as generateNanoId } from "@/utils/nanoIdGenerate"
import { ResultSetHeader, RowDataPacket } from "mysql2"

interface UserRow extends IUser, RowDataPacket {
    role: string
}

// Create a new user and return its nano_id
export const signUp = async (input: ISignUp): Promise<string> => {
    const id = generateNanoId()
    const roleId = 1001 // Default "user" role
    const db = await Database.getInstance()

    try {
        const [result] = await db.execute<ResultSetHeader>(
            `INSERT INTO users (nano_id, name, email, password, role_id)
       VALUES (?, ?, ?, ?, ?)`,
            [id, input.name, input.email, input.password, roleId]
        )

        if (result.affectedRows === 0) {
            throw new CustomError("User could not be created", 500)
        }

        return id
    } catch (err: any) {
        // Duplicate email
        if (err.code === "ER_DUP_ENTRY") {
            throw new CustomError("Email already registered", 409)
        }
        // Generic DB error
        throw new CustomError(
            err.message || "Database error during sign-up",
            500
        )
    }
}

// Find a user by email, joining role name
export const findUserByEmail = async (
    email: string
): Promise<UserRow | null> => {
    const db = await Database.getInstance()
    try {
        const [rows] = await db.execute<UserRow[]>(
            `SELECT u.*, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
            [email]
        )
        return rows.length > 0 ? rows[0] : null
    } catch (err: any) {
        throw new CustomError(
            err.message || "Database error fetching user by email",
            500
        )
    }
}

// Mark email as verified
export const markEmailVerified = async (email: string): Promise<void> => {
    const db = await Database.getInstance()
    try {
        await db.execute(
            `UPDATE users SET email_verified = true WHERE email = ?`,
            [email]
        )
    } catch (err: any) {
        throw new CustomError(
            err.message || "Database error marking email verified",
            500
        )
    }
}

// Mark email as not verified
export const markEmailNotVerified = async (email: string): Promise<void> => {
    const db = await Database.getInstance()
    try {
        await db.execute(
            `UPDATE users SET email_verified = false WHERE email = ?`,
            [email]
        )
    } catch (err: any) {
        throw new CustomError(
            err.message || "Database error marking email not verified",
            500
        )
    }
}

// Save Google Auth secret and enable 2FA flag
export const saveGoogleAuthSecret = async (
    email: string,
    secret: string
): Promise<void> => {
    const db = await Database.getInstance()
    try {
        await db.execute(
            `UPDATE users
       SET google_auth_secret = ?, google_auth_enabled = true
       WHERE email = ?`,
            [secret, email]
        )
    } catch (err: any) {
        throw new CustomError(
            err.message || "Database error saving 2FA secret",
            500
        )
    }
}

// Update password after reset
export const setNewPasswordAfterReset = async (
    email: string,
    hashedPassword: string
): Promise<void> => {
    const db = await Database.getInstance()
    try {
        await db.execute(`UPDATE users SET password = ? WHERE email = ?`, [
            hashedPassword,
            email,
        ])
    } catch (err: any) {
        throw new CustomError(
            err.message || "Database error setting new password",
            500
        )
    }
}
