import Database from "@/config/dbConfig"
import { ISignUp, IUser } from "@/models/auth.model"
import { ResultSetHeader, RowDataPacket } from "mysql2"

interface UserRow extends IUser, RowDataPacket {}

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
