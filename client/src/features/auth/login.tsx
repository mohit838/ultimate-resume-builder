import { useLogIn } from '@/hooks/useLoginAndSignup'
import { useNotification } from '@/hooks/useNotification'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const LoginPage = () => {
    const [loginForm] = Form.useForm()
    const { success } = useNotification()
    const navigate = useNavigate()
    const loginMutation = useLogIn()

    const handleSubmit = (values: { email: string; password: string }) => {
        loginMutation.mutate(values)

        if (loginMutation.isSuccess) {
            // Reset form fields after submission
            loginForm.resetFields()
            // Optionally, you can also clear any previous error messages
            loginForm.setFields([
                { name: 'email', errors: [] },
                { name: 'password', errors: [] },
            ])

            success('Login successful!')
            navigate('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                {/* Title */}
                <div className="text-center mb-6">
                    <Title level={2} className="!mb-1">
                        Ultimate Resume
                    </Title>
                    <Text type="secondary">Please sign in to continue</Text>
                </div>

                {/* Form */}
                <Form
                    form={loginForm}
                    name="login"
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email',
                            },
                            { type: 'email', message: 'Enter a valid email' },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password',
                            },
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Enter your password"
                        />
                    </Form.Item>

                    <div className="flex justify-between mb-4 text-sm">
                        <Link to="/signup">Don't have an account?</Link>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <Form.Item className="mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={loginMutation.isPending}
                            disabled={loginMutation.isPending}
                        >
                            LogIn
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage
