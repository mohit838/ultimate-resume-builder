import { Card } from 'antd'
import { ReactNode } from 'react'

const CommonCard = ({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) => {
    return <Card title={title}> {children}</Card>
}

export default CommonCard
