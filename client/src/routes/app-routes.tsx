import { ProtectedRoute } from '@/auth-helper-wrapper/protected'
import { PublicRoute } from '@/auth-helper-wrapper/public'
import LoaderSpinner from '@/components/ui/loader'
import { routeConfig } from '@/config/routes'
import NotFoundPage from '@/pages/not-found/NotFound'
import { Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

const AppRoutes = () => {
    const routes = useRoutes([
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        ...routeConfig.map(
            ({ path, element: Element, private: isPrivate }) => ({
                path,
                element: (
                    <Suspense fallback={<LoaderSpinner />}>
                        {isPrivate ? (
                            <ProtectedRoute>
                                <Element />
                            </ProtectedRoute>
                        ) : (
                            <PublicRoute>
                                <Element />
                            </PublicRoute>
                        )}
                    </Suspense>
                ),
            })
        ),
        { path: '*', element: <NotFoundPage /> },
    ])

    return routes
}

export default AppRoutes
