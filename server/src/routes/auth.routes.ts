import { logIn, signUp } from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import { blockIfAuthenticated } from "@/middlewares/authGuard"
import {
    loginSchema,
    signUpSchema,
} from "@/middlewares/validations/auth.schema"
import { validate } from "@/middlewares/validations/auth.validation"
import express from "express"

const router = express.Router()

router
    .post(
        "/signup",
        blockIfAuthenticated,
        validate(signUpSchema),
        asyncHandler(signUp)
    )
    .post(
        "/login",
        blockIfAuthenticated,
        validate(loginSchema),
        asyncHandler(logIn)
    )

export default router
