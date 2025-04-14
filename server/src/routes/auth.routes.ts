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

import redisClient from "@/config/redisClient"
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
import { successResponse } from "@/helper/ApiResponse"

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
router.post("/refresh", requireAuth, asyncHandler(refreshToken))
router.post("/logout", requireAuth, asyncHandler(logout))

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

//TODO:: Move later in controller and services
router.get(
    "/otp-ttl",
    asyncHandler(async (req, res) => {
        const { email } = req.query
        const ttl = await redisClient.ttl(`otp_${email}`)
        return successResponse(res, { ttl }, "Fetched OTP TTL")
    })
)

// 2FA (Optional but cool)
router.post("/enable-2fa", requireAuth, asyncHandler(generate2FA))
router.post("/verify-2fa", requireAuth, asyncHandler(verifyGoogle2FA))

// Just for role testing (you can delete this in prod)
router.get(
    "/admin-only",
    requireAuth,
    authorizeRoles("admin", "superadmin"),
    asyncHandler(testRoleBase)
)

export default router
