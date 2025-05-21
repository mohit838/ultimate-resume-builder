import { useDisable2FA, useGenerate2FA, useVerify2FA } from '@/hooks/use2fa'
import useAuthStore from '@/stores/useAuthStore'
import { Button, Card, Form, Input, Spin, Typography } from 'antd'
import React from 'react'

const { Title, Text } = Typography

const Enable2faPage: React.FC = () => {
    const { user } = useAuthStore()
    const gen2FA = useGenerate2FA()
    const verify2FA = useVerify2FA()
    const disable2FA = useDisable2FA()
    const [form] = Form.useForm()

    // 1) If 2FA is enabled, show disable button
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
                            loading={disable2FA.isPending}
                            onClick={() => disable2FA.mutate()}
                        >
                            Disable 2FA
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // 2) Not enabled => if no setup yet, show a “Generate” button
    const setup = gen2FA.data
    if (!setup) {
        return (
            <div
                className="flex justify-center items-center px-4"
                style={{ minHeight: 'calc(100vh - 4rem)' }}
            >
                <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                    <Title level={3}>Enable Two-Factor Authentication</Title>
                    <Text>
                        Click below to generate a new 2FA setup (QR code +
                        secret).
                    </Text>
                    <div className="mt-6">
                        <Button
                            type="primary"
                            block
                            loading={gen2FA.isPending}
                            onClick={() => gen2FA.mutate()}
                        >
                            Generate 2FA Setup
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // 3) Setup exists => show QR, secret, and code form
    const { qrCode, secret } = setup
    const onFinish = ({ code }: { code: string }) => verify2FA.mutate(code)

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
                    ) : (
                        <img
                            src={qrCode}
                            alt="2FA QR Code"
                            className="mx-auto"
                        />
                    )}
                </div>

                <Text copyable code className="block text-center mb-4">
                    {secret}
                </Text>

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
