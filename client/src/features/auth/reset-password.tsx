import { useResetPasswordMutation } from '@/hooks/useAuth'
import { LockOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const ResetPasswordPage = () => {
    const navigate = useNavigate()

    const email = localStorage.getItem('email_forgot') || ''

    const otp_verified =
        localStorage.getItem('otp_verified') === 'true' || false

    if (!otp_verified || !email) {
        navigate('/login')
    }

    const [form] = Form.useForm()
    const { mutate, isPending } = useResetPasswordMutation()

    const handleReset = (values: {
        password: string
        confirmPassword: string
    }) => {
        if (!email) return

        mutate({
            email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        })
    }

    useEffect(() => {
        if (!otp_verified || !email) {
            navigate('/login', { replace: true })
        }
    }, [otp_verified, email, navigate])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                <div className="text-center mb-6">
                    <Title level={2}>Reset Your Password</Title>
                    <Text type="secondary">
                        Please enter a new password below
                    </Text>
                </div>

                <Form
                    disabled={!otp_verified || !email}
                    layout="vertical"
                    form={form}
                    onFinish={handleReset}
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your new password',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="New password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    return !value ||
                                        getFieldValue('password') === value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                              'Passwords do not match'
                                          )
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm password"
                        />
                    </Form.Item>

                    <div className="flex justify-between mb-4 text-sm">
                        <Link to="/signup">Don't have an account?</Link>
                        <Link to="/login">Already have an account?</Link>
                    </div>

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

export default ResetPasswordPage
