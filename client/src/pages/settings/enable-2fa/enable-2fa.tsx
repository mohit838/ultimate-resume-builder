import { useGenerate2FA, useVerify2FA } from '@/hooks/use2FA'
import useAuthStore from '@/stores/useAuthStore'
import { Button, Card, Form, Input, Spin, Typography } from 'antd'
import React, { useEffect } from 'react'

const { Title, Text } = Typography

const Enable2faPage: React.FC = () => {
    const { token } = useAuthStore()
    const gen2FA = useGenerate2FA()
    const verify2FA = useVerify2FA()
    const [form] = Form.useForm()

    // On mount: fetch QR + secret
    useEffect(() => {
        if (token) gen2FA.mutate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    // Form submit to verify
    const onFinish = ({ code }: { code: string }) => {
        verify2FA.mutate(code)
    }

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md p-6">
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
                    <Text copyable code>
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
