import { CustomError } from "@/errors/CustomError"
import { successResponse } from "@/helper/ApiResponse"
import {
    createCategoryService,
    getAllCategoryService,
} from "@/services/category.service"
import { Request, Response } from "express"
import { validationResult } from "express-validator"

export const createCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new CustomError("Validation failed", 400)
    }

    const { name, description } = req.body
    const category = await createCategoryService({ name, description })

    return successResponse(res, category, "Category created", 201)
}

export const getAllCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const categories = await getAllCategoryService()
    successResponse(res, categories, "Categories fetched", 200)
}
