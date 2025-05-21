import { CustomError } from "@/errors/CustomError"
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
import express, { NextFunction, Request, Response } from "express"

import {
    disable2FA,
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

// Public: Signup & Login
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

// Logout (must be authenticated)
router.post("/logout", requireAuth, asyncHandler(logout))

// Refresh token (allow only expired tokens through)
router.post("/refresh", allowExpiredAccessToken, asyncHandler(refreshToken))

// Forgot / Reset Password
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

// OTP flows

// Verify an OTP (must supply email + numeric otp)
router.post(
    "/verify-otp",
    (req: Request, _res: Response, next: NextFunction) => {
        const { email, otp } = req.body
        if (!email || typeof otp !== "number") {
            return next(
                new CustomError(
                    "Email and valid OTP are required to verify",
                    400
                )
            )
        }
        next()
    },
    asyncHandler(verifyOtp)
)

// Resend an OTP (must supply email)
router.post(
    "/resend-otp",
    (req: Request, _res: Response, next: NextFunction) => {
        const { email } = req.body
        if (!email) {
            return next(new CustomError("Email is required to resend OTP", 400))
        }
        next()
    },
    asyncHandler(requestOtp)
)

// Check OTP TTL (must supply email query param)
router.get(
    "/otp-ttl",
    (req: Request, _res: Response, next: NextFunction) => {
        const email = req.query.email
        if (typeof email !== "string") {
            return next(
                new CustomError(
                    "Email query parameter is required to check TTL",
                    400
                )
            )
        }
        next()
    },
    asyncHandler(getOtpTtl)
)

// 2FA (Google Authenticator)
router.post("/enable-2fa", requireAuth, asyncHandler(generate2FA))
router.post("/verify-2fa", requireAuth, asyncHandler(verifyGoogle2FA))
router.post("/disable-2fa", requireAuth, asyncHandler(disable2FA))

// Role‐based test endpoint (only admin & superadmin)
router.get(
    "/admin-only",
    requireAuth,
    authorizeRoles("admin", "superadmin"),
    asyncHandler(testRoleBase)
)

export default router
