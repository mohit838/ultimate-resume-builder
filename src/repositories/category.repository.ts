import Database from "@/config/dbConfig"
import { CategoryCreateInput, FetchAllCategory } from "@/models/category.model"
import { ResultSetHeader, RowDataPacket } from "mysql2"

export const createCategory = async (
    input: CategoryCreateInput
): Promise<number> => {
    const db = await Database.getInstance()

    const [result] = await db.execute<ResultSetHeader>(
        "INSERT INTO categories (name, description) VALUES (?, ?)",
        [input.name, input.description || null]
    )
    return result.insertId
}

export const getAllCategories = async (): Promise<FetchAllCategory[]> => {
    const db = await Database.getInstance()

    const [rows] = await db.execute<RowDataPacket[]>("SELECT * FROM categories")

    return rows as FetchAllCategory[]
}
