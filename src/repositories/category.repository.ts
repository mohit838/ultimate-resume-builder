import Database from "@/config/dbConfig"
import { CategoryCreateInput } from "@/models/category.model"
import { ResultSetHeader } from "mysql2"

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
