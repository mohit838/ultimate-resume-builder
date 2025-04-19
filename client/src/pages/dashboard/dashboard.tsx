import api from '@/api/axios'
import LoaderSpinner from '@/components/ui/loader'
import { endpoints } from '@/services/endpoints'
import { useQuery } from '@tanstack/react-query'

const DashboardPage = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get(`${endpoints.auth.testRoleBase}`)
            if (!response) {
                throw new Error('Network response was not ok')
            }
            return response
        },
    })

    if (isLoading) {
        return <LoaderSpinner />
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to your dashboard!</p>

            <div className="mt-4">
                <p>
                    Here you can view your statistics and manage your account.
                </p>
            </div>

            <div className="mt-4">
                <p>Statistics:</p>
                <p>{data?.data?.message}</p>
                {/* Statistics component goes here */}
            </div>

            <div className="mt-4">
                <p>Account settings:</p>
                {/* Account settings component goes here */}
            </div>
            <div className="mt-4">
                <p>Recent activity:</p>
                {/* Recent activity component goes here */}
            </div>
        </div>
    )
}

export default DashboardPage
