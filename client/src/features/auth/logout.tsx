import api from '@/api/axios'
import LoaderSpinner from '@/components/ui/loader'
import { endpoints } from '@/services/endpoints'
import useAuthStore from '@/stores/useAuthStore'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const LogoutHandler = () => {
    const logout = useAuthStore((state) => state.logout)
    const token = useAuthStore((state) => state.token)
    const [isLoggedOut, setIsLoggedOut] = useState(false)

    useEffect(() => {
        const handleLogout = async () => {
            try {
                if (token) {
                    await api.post(
                        `${endpoints.auth.logout}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                }
            } catch (error) {
                console.error('Logout API failed', error)
            } finally {
                logout()
                setIsLoggedOut(true)
            }
        }

        handleLogout()
    }, [logout, token])

    if (isLoggedOut) {
        return <Navigate to="/login" replace />
    }

    return <LoaderSpinner />
}

export default LogoutHandler
