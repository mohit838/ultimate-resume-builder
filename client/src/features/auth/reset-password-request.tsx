import { useForgotPasswordMutation } from '@/hooks/useForgotPassword'
import useResetPassStore from '@/stores/useResetPassStore'
import { MailOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'

const { Title, Text } = Typography

const ResetPasswordRequestPage = () => {
    const [form] = Form.useForm()
    const { mutate, isPending } = useForgotPasswordMutation()
    const { setResetEmail } = useResetPassStore()

    const handleReset = (values: { email: string }) => {
        localStorage.removeItem('auth-storage')
        localStorage.removeItem('refresh_token')

        if (values?.email) {
            setResetEmail(values.email)
            mutate(values.email)
            form.resetFields()
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                <div className="text-center mb-6">
                    <Title level={2}>Reset Your Password Request</Title>
                    <Text type="secondary">
                        Please enter a registered email below
                    </Text>
                </div>

                <Form form={form} layout="vertical" onFinish={handleReset}>
                    <Form.Item
                        name="email"
                        label="Your registered email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email',
                            },
                            { type: 'email', message: 'Enter a valid email' },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                            type="email"
                        />
                    </Form.Item>

                    <Form.Item className="mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={isPending}
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default ResetPasswordRequestPage
