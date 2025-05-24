import { useVerify2FA } from '@/hooks/use2fa'
import useAuthStore from '@/stores/useAuthStore'
import { Button, Card, Form, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const Verify2FALoginPage: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore()
    const verify2FA = useVerify2FA()
    const navigate = useNavigate()

    // if someone lands here by mistake
    useEffect(() => {
        if (!isAuthenticated) navigate('/login')
        else if (!user?.googleAuthEnabled) navigate('/dashboard')
    }, [isAuthenticated, user, navigate])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-sm shadow-md rounded-lg">
                <div className="text-center mb-4">
                    <Title level={3}>Two-Factor Authentication</Title>
                    <Text>
                        Enter the 6-digit code from your authenticator app to
                        continue.
                    </Text>
                </div>

                <Form
                    layout="vertical"
                    onFinish={(vals: { code: string }) =>
                        verify2FA.mutate(vals.code)
                    }
                >
                    <Form.Item
                        label="Authentication Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the 6-digit code',
                            },
                            {
                                pattern: /^\d{6}$/,
                                message: 'Code must be exactly 6 digits',
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="123456"
                            className="text-center text-xl"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={verify2FA.isPending}
                        >
                            Verify & Continue
                        </Button>
                    </Form.Item>
                </Form>

                {verify2FA.isError && (
                    <Text type="danger">
                        {(verify2FA.error as Error).message}
                    </Text>
                )}
            </Card>
        </div>
    )
}

export default Verify2FALoginPage
