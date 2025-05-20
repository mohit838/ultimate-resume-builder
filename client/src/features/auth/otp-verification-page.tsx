import api from '@/api/axios'
import { useResendOtp, useVerifyOtp } from '@/hooks/useOtpMutation'
import { endpoints } from '@/services/endpoints'
import useResetPassStore from '@/stores/useResetPassStore'
import useSignUpStore from '@/stores/useSignUpStore'
import { Button, Card, Form, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const OtpVerificationPage = () => {
    const [form] = Form.useForm()
    const { email, isSignedUp } = useSignUpStore()
    const { resetEmail, isResetPass } = useResetPassStore()
    const navigate = useNavigate()

    // State to manage OTP resend button and countdown
    const [resendDisabled, setResendDisabled] = useState(true)
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

    const forOtpEmail = isResetPass ? resetEmail : email

    const verifyOtpMutation = useVerifyOtp(forOtpEmail)
    const resendOtpMutation = useResendOtp(forOtpEmail)

    // Fetch TTL from backend on mount
    useEffect(() => {
        const fetchTTL = async () => {
            try {
                const { data } = await api.get(`${endpoints.auth.otpTtl}`, {
                    params: { email: forOtpEmail },
                })

                if (!data) {
                    console.error('No data received from OTP TTL endpoint')
                    return
                }
                const ttl = data?.model?.ttl ?? 0
                if (ttl > 0) {
                    setResendDisabled(true)
                    setSecondsLeft(ttl)
                } else {
                    setResendDisabled(false)
                }
                localStorage.setItem('otp_verified', 'false')
            } catch (err) {
                console.error('Failed to fetch TTL', err)
                setResendDisabled(false)
            }
        }

        if (forOtpEmail) {
            fetchTTL()
        }
    }, [forOtpEmail])

    // Countdown timer effect
    useEffect(() => {
        if (resendDisabled && secondsLeft !== null) {
            const interval = setInterval(() => {
                setSecondsLeft((prev) => {
                    if (prev && prev <= 1) {
                        clearInterval(interval)
                        setResendDisabled(false)
                        return 0
                    }
                    return prev! - 1
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [resendDisabled, secondsLeft])

    // Form submit
    const handleVerifyOtp = ({ otp }: { otp: string }) => {
        verifyOtpMutation.mutate(otp)
    }

    // Resend OTP click
    const handleResendOtp = () => {
        resendOtpMutation.mutate(undefined, {
            onSuccess: (data) => {
                const ttl = data?.model?.ttl ?? 180
                setResendDisabled(true)
                setSecondsLeft(ttl)
            },
        })
    }

    useEffect(() => {
        if (isResetPass && verifyOtpMutation.isSuccess) {
            navigate('/reset-password', { replace: true })
        } else if (isSignedUp && verifyOtpMutation.isSuccess) {
            navigate('/login', { replace: true })
        }
    }, [
        forOtpEmail,
        navigate,
        isResetPass,
        verifyOtpMutation.isSuccess,
        isSignedUp,
    ])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Verify OTP</Title>
                    <Text type="secondary">
                        We sent a code to your email: <strong>{email}</strong>
                    </Text>
                </div>

                <Form form={form} layout="vertical" onFinish={handleVerifyOtp}>
                    <Form.Item
                        name="otp"
                        label="Enter OTP"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the OTP code',
                            },
                        ]}
                    >
                        <Input maxLength={6} placeholder="Enter 6-digit code" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                            loading={verifyOtpMutation.isPending}
                        >
                            Verify OTP
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center text-sm mt-4">
                    {resendDisabled ? (
                        <Text type="secondary">
                            You can resend code in {secondsLeft}s
                        </Text>
                    ) : (
                        <Button
                            type="link"
                            onClick={handleResendOtp}
                            loading={resendOtpMutation.isPending}
                        >
                            Resend OTP
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default OtpVerificationPage
