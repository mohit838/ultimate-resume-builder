import {
    logIn,
    logout,
    refreshToken,
    signUp,
    verifyOtp,
} from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import { blockIfAuthenticated, requireAuth } from "@/middlewares/authGuard"
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
    .post("/logout", requireAuth, asyncHandler(logout))
    .post("/refresh", requireAuth, asyncHandler(refreshToken))
    .post("/otp", asyncHandler(verifyOtp))
//TODO:: resend otp

export default router
