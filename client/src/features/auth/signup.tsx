import { useSignup } from '@/hooks/useLoginAndSignup'
import { useNotification } from '@/hooks/useNotification'
import useSignUpStore from '@/stores/useSignUpStore'
import { handleAxiosError } from '@/utils/handleAxiosError'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const SignupPage = () => {
    const [form] = Form.useForm()
    const { success, error } = useNotification()
    const { setEmail, setSignedUp } = useSignUpStore()
    const navigate = useNavigate()
    const signupFn = useSignup()

    const handleSubmit = async (values: {
        username: string
        email: string
        password: string
    }) => {
        try {
            signupFn.mutateAsync(values)

            if (signupFn.isSuccess) {
                // Reset form fields after submission
                form.resetFields()
                // Optionally, you can also clear any previous error messages
                form.setFields([
                    { name: 'username', errors: [] },
                    { name: 'email', errors: [] },
                    { name: 'password', errors: [] },
                ])
                // Handle success response
                const msg = signupFn.data?.message
                if (msg) {
                    success(msg || 'Signup successful! Please verify OTP.')
                    setEmail(values.email)
                    setSignedUp(true)
                    navigate('/verify-otp')
                }
            }
        } catch (err: unknown) {
            handleAxiosError(err, error)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                {/* Title */}
                <div className="text-center mb-6">
                    <Title level={2} className="!mb-1">
                        Ultimate Resume
                    </Title>
                    <Text type="secondary">Create your account</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Name"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your name',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter your name"
                        />
                    </Form.Item>

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
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a password',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter a password"
                        />
                    </Form.Item>

                    <div className="flex justify-between mb-4 text-sm">
                        <Link to="/login">Already have an account?</Link>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <Form.Item className="mt-6">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default SignupPage
