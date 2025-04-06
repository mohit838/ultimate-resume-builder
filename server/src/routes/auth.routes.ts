import { logIn, signUp } from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import {
    loginSchema,
    signUpSchema,
} from "@/middlewares/validations/auth.schema"
import { validate } from "@/middlewares/validations/auth.validation"
import express from "express"

const router = express.Router()

router
    .post("/signup", validate(signUpSchema), asyncHandler(signUp))
    .post("/login", validate(loginSchema), asyncHandler(logIn))

export default router
