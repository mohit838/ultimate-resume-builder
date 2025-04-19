import { z } from "zod"

export const signUpSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(50, "Username must be at most 50 characters"),

    email: z
        .string()
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email must be at most 255 characters")
        .email("Email must be valid"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),
})

export const loginSchema = z.object({
    email: z
        .string()
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email must be at most 255 characters")
        .email("Email must be valid"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),
})

export const forgotPassword = z.object({
    email: z
        .string()
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email must be at most 255 characters")
        .email("Email must be valid"),
})

export const resetPassword = z.object({
    email: z
        .string()
        .min(5, "Email must be at least 5 characters")
        .max(255, "Email must be at most 255 characters")
        .email("Email must be valid"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be at most 32 characters"),
})
