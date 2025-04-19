import { Spin } from 'antd'

const LoaderSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
        </div>
    )
}

export default LoaderSpinner
