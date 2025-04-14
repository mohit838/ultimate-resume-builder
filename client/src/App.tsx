import AppRoutes from '@/routes/routes'
import useAuthStore from '@/stores/useAuthStore'
import { useLocation } from 'react-router-dom'
import { ResumeLayout } from './components/layouts/resume-layout'
import { publicPaths } from './config/routes'

const App = () => {
    const isAuth = useAuthStore((state) => state.isAuthenticated)
    const location = useLocation()
    const isPublicRoute = publicPaths.includes(location.pathname)

    const shouldUseLayout = isAuth || (!isAuth && !isPublicRoute)

    return shouldUseLayout ? (
        <ResumeLayout>
            <AppRoutes />
        </ResumeLayout>
    ) : (
        <AppRoutes />
    )
}

export default App
