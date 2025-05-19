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
import ResumePage from "@/features/resume/resume"
import DashboardPage from "@/pages/dashboard/dashboard"
import Enable2faPage from "@/pages/settings/enable-2fa/enable-2fa"
import ProfilePage from "@/pages/settings/profile/profile"

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
        element: DashboardPage,
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
        element: ProfilePage,
        private: true,
        menu: {
            name: "Profile",
            parent: "Settings",
        },
    },
    {
        path: "/settings/enable-2fa",
        element: Enable2faPage,
        private: true,
        menu: {
            name: "Enable 2FA",
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
