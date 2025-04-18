import theme from '@/styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

const AppProviders = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default AppProviders
