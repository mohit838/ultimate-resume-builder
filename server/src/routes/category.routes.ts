import {
    createCategory,
    getAllCategory,
} from "@/controllers/category.controller"
import { asyncHandler } from "@/helper/hof"
import express from "express"
import { body } from "express-validator"

const router = express.Router()

router.post(
    "/",
    [
        body("name")
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 2, max: 50 }),
        body("description").optional().isLength({ max: 255 }),
    ],
    asyncHandler(createCategory)
)

router.get("/", asyncHandler(getAllCategory))

export default router
