import { Breadcrumb, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

export interface PageHeaderBlockProps {
    title: string
    description?: string
    breadcrumbs: { name: string; path: string }[]
    className?: string
    children?: React.ReactNode
}

const PageHeaderBlock = ({
    title,
    description,
    breadcrumbs,
    className = '',
    children,
}: PageHeaderBlockProps) => {
    return (
        <div className={`px-4 sm:px-6 lg:px-8 ${className}`}>
            {/* Header + Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Title level={2} className="mb-1">
                        {title}
                    </Title>
                    {description && <Text type="secondary">{description}</Text>}
                </div>

                <Breadcrumb>
                    {breadcrumbs?.map((bc, i) => (
                        <Breadcrumb.Item key={i}>
                            {i < breadcrumbs.length - 1 ? (
                                <Link to={bc.path} className="hover:underline">
                                    {bc.name}
                                </Link>
                            ) : (
                                <Text>{bc.name}</Text>
                            )}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-gray-200" />

            {/* Page Content */}
            <div className="mt-6">{children}</div>
        </div>
    )
}

export default PageHeaderBlock
