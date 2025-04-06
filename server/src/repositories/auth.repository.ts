import Database from "@/config/dbConfig"
import { ISignUp, IUser } from "@/models/auth.model"
import { ResultSetHeader, RowDataPacket } from "mysql2"
import { customAlphabet } from "nanoid"

interface UserRow extends IUser, RowDataPacket {}

const nanoid = customAlphabet("1234567890abcdef", 21)

export const signUp = async (input: ISignUp): Promise<string> => {
    const nanoId = nanoid()

    const db = await Database.getInstance()

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (nano_id, name, email, password) VALUES (?, ?, ?, ?)",
        [nanoId, input.name, input.email, input.password]
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
        "SELECT * FROM users WHERE email = ?",
        [email]
    )

    return rows.length ? rows[0] : null
}
