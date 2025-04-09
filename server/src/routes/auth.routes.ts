import {
    logIn,
    logout,
    refreshToken,
    requestOtp,
    signUp,
    testRoleBase,
    verifyOtp,
} from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import { blockIfAuthenticated, requireAuth } from "@/middlewares/authGuard"
import { authorizeRoles } from "@/middlewares/roleGuard"
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
    .post("/otp", blockIfAuthenticated, asyncHandler(verifyOtp))
    .post("/resend-otp", blockIfAuthenticated, asyncHandler(requestOtp))
    // Role test route # Delete if you want
    .get(
        "/admin-only",
        requireAuth,
        authorizeRoles("user", "admin", "superadmin"),
        asyncHandler(testRoleBase)
    )

export default router
