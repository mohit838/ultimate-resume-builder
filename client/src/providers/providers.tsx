import theme from '@/styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntdApp, ConfigProvider } from 'antd'
import { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

const AppProviders = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient()

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider theme={theme}>
                    <AntdApp>{children}</AntdApp>
                </ConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default AppProviders
