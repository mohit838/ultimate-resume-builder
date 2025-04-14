import theme from '@/styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import { ReactNode } from 'react'


const AppProviders = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider theme={theme}>{children}</ConfigProvider>
        </QueryClientProvider>
    )
}

export default AppProviders
