import { RouteItem } from "@/types/types"
import {
    AppstoreOutlined,
    FileTextOutlined,
    LogoutOutlined,
} from "@ant-design/icons"
import React from "react"

export const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
]

// Lazy imports
const DashboardPage = React.lazy(() => import("@/pages/dashboard/dashboard"))
const ResumePage = React.lazy(() => import("@/features/resume/resume"))
const ProfilePage = React.lazy(() => import("@/pages/settings/profile/profile"))
const Enable2faPage = React.lazy(
    () => import("@/pages/settings/enable-2fa/enable-2fa")
)
const LogoutHandler = React.lazy(() => import("@/features/auth/logout"))
const LoginPage = React.lazy(() => import("@/features/auth/login"))
const SignupPage = React.lazy(() => import("@/features/auth/signup"))
const ResetPasswordPage = React.lazy(
    () => import("@/features/auth/reset-password")
)
const OtpVerificationPage = React.lazy(
    () => import("@/features/auth/otp-verification-page")
)

const ResetPasswordRequestPage = React.lazy(
    () => import("@/features/auth/reset-password-request")
)

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
