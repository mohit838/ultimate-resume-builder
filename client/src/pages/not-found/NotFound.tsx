import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you are looking for does not exist."
                extra={
                    <Button
                        type="primary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Go Home
                    </Button>
                }
            />
        </div>
    )
}

export default NotFoundPage
