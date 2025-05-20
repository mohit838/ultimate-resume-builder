import { useResetPasswordMutation } from '@/hooks/useResetPassword'
import useResetPassStore from '@/stores/useResetPassStore'
import { LockOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const ResetPasswordPage = () => {
    const [form] = Form.useForm()
    const { mutate, isPending } = useResetPasswordMutation()
    const navigate = useNavigate()
    const { resetEmail } = useResetPassStore()

    const handleReset = (values: {
        password: string
        confirmPassword: string
    }) => {
        if (!resetEmail) return

        mutate({
            email: resetEmail,
            password: values.password,
            confirmPassword: values.confirmPassword,
        })

        navigate('/login')
        form.resetFields()
    }

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
                    disabled={!resetEmail}
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
