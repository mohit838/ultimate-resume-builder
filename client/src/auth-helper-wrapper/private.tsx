import LoaderSpinner from '@/components/ui/loader'
import useAuthStore from '@/stores/useAuthStore'
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const Private = ({ children }: { children: ReactNode }) => {
    const isLoading = useAuthStore((state) => state.isLoading)
    const isAuth = useAuthStore((state) => state.isAuthenticated)
    const location = useLocation()

    if (isLoading) return <LoaderSpinner />

    if (!isAuth)
        return <Navigate to="/login" state={{ from: location }} replace />

    return children
}
