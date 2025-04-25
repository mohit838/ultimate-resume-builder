import { useNotification } from '@/hooks/useNotification'
import { loginApi } from '@/services/auth/auth'
import useAuthStore from '@/stores/useAuthStore'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Card, Form, Input, Typography } from 'antd'
import { AxiosError } from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const LoginPage = () => {
    const [form] = Form.useForm()
    const { success, error } = useNotification()
    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const mutation = useMutation({
        mutationFn: loginApi,
        onSuccess: (response) => {
            // Remove first if user go for reset but not sending reset password
            localStorage.removeItem('otp_verified')
            localStorage.removeItem('email_forgot')

            const {
                accessToken,
                refreshToken,
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            } = response.model

            localStorage.setItem('refresh_token', refreshToken)

            login(accessToken, {
                id,
                name,
                email,
                role,
                emailVerified,
                googleAuthEnabled,
            })

            form.resetFields()
            success('Login successful!')
            navigate('/dashboard')
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            error(err?.response?.data?.message || 'Login failed')
        },
    })

    const handleSubmit = (values: { email: string; password: string }) => {
        mutation.mutate(values)
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
                            loading={mutation.isPending}
                            disabled={mutation.isPending}
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
