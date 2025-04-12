import {
    generate2FA,
    logIn,
    logout,
    refreshToken,
    requestOtp,
    requestOtpForForgotPassword,
    requestResetPassword,
    signUp,
    testRoleBase,
    verifyGoogle2FA,
    verifyOtp,
} from "@/controllers/auth.controller"
import { asyncHandler } from "@/helper/hof"
import { blockIfAuthenticated, requireAuth } from "@/middlewares/authGuard"
import { authorizeRoles } from "@/middlewares/roleGuard"
import {
    forgotPassword,
    loginSchema,
    resetPassword,
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

// Reset password
router.post(
    "/forgot-password",
    validate(forgotPassword),
    asyncHandler(requestOtpForForgotPassword)
)
router.post(
    "/reset-password",
    validate(resetPassword),
    asyncHandler(requestResetPassword)
)

// OTP routes
router
    .post("/otp", blockIfAuthenticated, asyncHandler(verifyOtp))
    .post("/resend-otp", blockIfAuthenticated, asyncHandler(requestOtp))

// Role test route # Delete if you want
router.get(
    "/admin-only",
    requireAuth,
    authorizeRoles("user", "admin", "superadmin"),
    asyncHandler(testRoleBase)
)

// 2FA system
router.post("/enable-2fa", requireAuth, asyncHandler(generate2FA))
router.post("/verify-2fa", requireAuth, asyncHandler(verifyGoogle2FA))

export default router
