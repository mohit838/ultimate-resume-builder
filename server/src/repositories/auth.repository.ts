import Database from "@/config/dbConfig"
import { ISignUp } from "@/models/auth.model"
import { ResultSetHeader } from "mysql2"

export const signUp = async (input: ISignUp): Promise<number> => {
    const db = await Database.getInstance()

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [input.name, input.email, input.password]
    )

    console.log(result)

    return result.insertId
}

export const findUserByEmail = async (email: string) => {
    const db = await Database.getInstance()

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
        email,
    ])
    return Array.isArray(rows) && rows.length ? rows[0] : null
}
