import { signUp } from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import { signUpSchema } from "@/middlewares/validations/auth.schema"
import { validate } from "@/middlewares/validations/auth.validation"
import express from "express"

const router = express.Router()

router.post("/signup", validate(signUpSchema), asyncHandler(signUp))

export default router
