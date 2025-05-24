import PageHeaderBlock from '@/components/layouts/page-header-block'
import DashboardPage from '../../features/dashboard/dashboard'

const DashboardIndexPage = () => {
    return (
        <PageHeaderBlock
            title="Dashboard"
            description="Welcome to your dashboard! Here you can view your statistics and manage your account."
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Dashboard', path: '/dashboard' },
            ]}
        >
            <DashboardPage />
        </PageHeaderBlock>
    )
}

export default DashboardIndexPage
