import useAuthStore from '@/stores/useAuthStore'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export const PublicRoute = ({ children }: { children: ReactNode }) => {
    const isAuth = useAuthStore((state) => state.isAuthenticated)

    if (isAuth) return <Navigate to="/dashboard" replace />

    return children
}
