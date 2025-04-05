import { CustomError } from "@/errors/CustomError"
import { CategoryCreateInput, FetchAllCategory } from "@/models/category.model"
import * as repo from "@/repositories/category.repository"

export const createCategoryService = async (data: CategoryCreateInput) => {
    if (!data.name || data.name.trim().length < 2) {
        throw new CustomError(
            "Category name must be at least 2 characters long",
            400
        )
    }

    const id = await repo.createCategory(data)
    return { id, ...data }
}

export const getAllCategoryService = async (): Promise<FetchAllCategory[]> => {
    return await repo.getAllCategories()
}
