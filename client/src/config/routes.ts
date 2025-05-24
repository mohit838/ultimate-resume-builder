import { RouteItem } from "@/types/types"
import {
    AppstoreOutlined,
    FileTextOutlined,
    LogoutOutlined,
} from "@ant-design/icons"
import React from "react"

// Import all pages
import LoginPage from "@/features/auth/login"
import LogoutHandler from "@/features/auth/logout"
import OtpVerificationPage from "@/features/auth/otp-verification-page"
import ResetPasswordPage from "@/features/auth/reset-password"
import ResetPasswordRequestPage from "@/features/auth/reset-password-request"
import SignupPage from "@/features/auth/signup"
import Verify2FALoginPage from "@/features/auth/verify2FA-login-page"
import ResumePage from "@/features/resume/resume"
import DashboardIndexPage from "@/pages/dashboard"
import ProfileIndexPage from "@/pages/settings/profile"

export const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
]

export const routeConfig: RouteItem[] = [
    {
        path: "/dashboard",
        element: DashboardIndexPage,
        private: true,
        menu: {
            name: "Dashboard",
            icon: React.createElement(AppstoreOutlined),
        },
    },
    {
        path: "/resume",
        element: ResumePage,
        private: true,
        menu: {
            name: "Resume",
            icon: React.createElement(FileTextOutlined),
        },
    },
    {
        path: "/settings/profile",
        element: ProfileIndexPage,
        private: true,
        menu: {
            name: "Profile",
            parent: "Settings",
        },
    },
    {
        path: "/logout",
        element: LogoutHandler,
        private: true,
        menu: {
            name: "Logout",
            icon: React.createElement(LogoutOutlined),
        },
    },
    {
        path: "/login",
        element: LoginPage,
        private: false,
    },
    {
        path: "/verify-2fa-login",
        element: Verify2FALoginPage,
        private: true,
    },
    {
        path: "/signup",
        element: SignupPage,
        private: false,
    },
    {
        path: "/forgot-password",
        element: ResetPasswordRequestPage,
        private: false,
    },
    {
        path: "/reset-password",
        element: ResetPasswordPage,
        private: false,
    },
    {
        path: "/verify-otp",
        element: OtpVerificationPage,
        private: false,
    },
]
