import { asyncHandler } from "@/helper/hof"
import {
    allowExpiredAccessToken,
    blockIfAuthenticated,
    requireAuth,
} from "@/middlewares/authGuard"
import { authorizeRoles } from "@/middlewares/roleGuard"
import {
    forgotPassword,
    loginSchema,
    resetPassword,
    signUpSchema,
} from "@/middlewares/validations/auth.schema"
import { validate } from "@/middlewares/validations/auth.validation"
import express from "express"

import {
    generate2FA,
    getOtpTtl,
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

const router = express.Router()

// Public Auth
router.post(
    "/signup",
    blockIfAuthenticated,
    validate(signUpSchema),
    asyncHandler(signUp)
)
router.post(
    "/login",
    blockIfAuthenticated,
    validate(loginSchema),
    asyncHandler(logIn)
)
router.post("/logout", requireAuth, asyncHandler(logout))

// Refresh Token
// This route is used to refresh the access token using the refresh token.
router.post("/refresh", allowExpiredAccessToken, asyncHandler(refreshToken))

// OTP-based Forgot/Reset Password Flow
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

router.post("/verify-otp", asyncHandler(verifyOtp))
router.post("/resend-otp", asyncHandler(requestOtp))

// OTP-based Login Flow get ttl
router.get("/otp-ttl", asyncHandler(getOtpTtl))

// 2FA (Optional but cool)
router.post("/enable-2fa", requireAuth, asyncHandler(generate2FA))
router.post("/verify-2fa", requireAuth, asyncHandler(verifyGoogle2FA))

// Just for role testing (you can delete this in prod)
router.get(
    "/admin-only",
    requireAuth,
    authorizeRoles("admin", "superadmin", "user"),
    asyncHandler(testRoleBase)
)

export default router
