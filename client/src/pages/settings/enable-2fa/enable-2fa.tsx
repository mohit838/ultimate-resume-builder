import { useDisable2FA, useGenerate2FA, useVerify2FA } from '@/hooks/use2fa'
import useAuthStore from '@/stores/useAuthStore'
import { Button, Card, Form, Input, Spin, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Title, Text } = Typography

const Enable2faPage: React.FC = () => {
    const [form] = Form.useForm()
    const { token, user } = useAuthStore()
    const gen2FA = useGenerate2FA()
    const verify2FA = useVerify2FA()
    const disable2FA = useDisable2FA()

    // If 2FA is already on, we won’t fetch QR/secret
    useEffect(() => {
        if (token && !user?.googleAuthEnabled) {
            gen2FA.mutate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, user?.googleAuthEnabled])

    const onFinish = ({ code }: { code: string }) => {
        verify2FA.mutate(code)
    }

    // If 2FA is enabled, show the disable UI
    if (user?.googleAuthEnabled) {
        return (
            <div
                className="flex justify-center items-center px-4"
                style={{ minHeight: 'calc(100vh - 4rem)' }}
            >
                <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                    <Title level={3}>Two-Factor Authentication</Title>
                    <Text type="success">✅ 2FA is currently enabled.</Text>
                    <div className="mt-6">
                        <Button
                            danger
                            block
                            onClick={() => disable2FA.mutate()}
                        >
                            <Text strong>⚠️</Text>
                            <Text strong className="ml-2">
                                Disable 2FA
                            </Text>
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // Otherwise show the enable flow
    return (
        <div
            className="flex justify-center items-center px-4"
            style={{ minHeight: 'calc(100vh - 4rem)' }}
        >
            <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                <Title level={3}>Enable Two-Factor Authentication</Title>
                <Text>Scan the QR code below with your authenticator app.</Text>

                <div className="text-center my-4">
                    {gen2FA.isPending ? (
                        <Spin />
                    ) : gen2FA.data?.qrCode ? (
                        <img
                            src={gen2FA.data.qrCode}
                            alt="2FA QR Code"
                            className="mx-auto"
                        />
                    ) : null}
                </div>

                {gen2FA.data?.secret && (
                    <Text copyable code className="block text-center mb-4">
                        {gen2FA.data.secret}
                    </Text>
                )}

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="mt-4"
                >
                    <Form.Item
                        label="Enter Code from App"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the 6-digit code',
                            },
                            {
                                pattern: /^\d{6}$/,
                                message: 'Code must be 6 digits',
                            },
                        ]}
                    >
                        <Input maxLength={6} placeholder="123456" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={verify2FA.isPending}
                        >
                            Enable 2FA
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Enable2faPage
