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
    const { email: storeEmail, isSignedUp } = useSignUpStore()
    const { resetEmail, isResetPass } = useResetPassStore()
    const navigate = useNavigate()

    // 1) Maintain otpEmail in state, init from store or fallback to localStorage
    const initialEmail =
        (isResetPass ? resetEmail : storeEmail) ||
        localStorage.getItem('otpEmail') ||
        ''
    const [otpEmail, setOtpEmail] = useState<string>(initialEmail)

    // Whenever we get a “fresh” email from the store, persist it
    useEffect(() => {
        const fromStore = isResetPass ? resetEmail : storeEmail
        if (fromStore) {
            setOtpEmail(fromStore)
            localStorage.setItem('otpEmail', fromStore)
        }
    }, [resetEmail, storeEmail, isResetPass])

    // If there's ever no email (unlikely), clear storage
    useEffect(() => {
        if (!otpEmail) {
            localStorage.removeItem('otpEmail')
        }
    }, [otpEmail])

    // OTP mutations (now keyed on stable otpEmail)
    const verifyOtpMutation = useVerifyOtp(otpEmail)
    const resendOtpMutation = useResendOtp(otpEmail)

    // UI state for TTL
    const [ttlLoading, setTtlLoading] = useState(true)
    const [resendDisabled, setResendDisabled] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(0)

    // 2) Fetch TTL when otpEmail is set
    useEffect(() => {
        if (!otpEmail) {
            setTtlLoading(false)
            setResendDisabled(false)
            return
        }

        let cancelled = false

        const fetchTTL = async () => {
            setTtlLoading(true)
            try {
                const { data } = await api.get(endpoints.auth.otpTtl, {
                    params: { email: otpEmail },
                })
                const ttl = data?.model?.ttl ?? 0

                if (!cancelled) {
                    if (ttl > 0) {
                        setResendDisabled(true)
                        setSecondsLeft(ttl)
                    } else {
                        setResendDisabled(false)
                        setSecondsLeft(0)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch TTL', err)
                if (!cancelled) {
                    setResendDisabled(false)
                    setSecondsLeft(0)
                }
            } finally {
                if (!cancelled) setTtlLoading(false)
            }
        }

        fetchTTL()
        return () => {
            cancelled = true
        }
    }, [otpEmail])

    // 3) Countdown effect
    useEffect(() => {
        if (!resendDisabled || secondsLeft <= 0) return
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    setResendDisabled(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [resendDisabled, secondsLeft])

    // 4) Verify OTP handler
    const handleVerifyOtp = ({ otp }: { otp: string }) => {
        verifyOtpMutation.mutate(otp)
    }

    // 5) Resend OTP handler
    const handleResendOtp = () => {
        resendOtpMutation.mutate(undefined, {
            onSuccess: (resp) => {
                const ttl = resp?.model?.ttl ?? 600
                setResendDisabled(true)
                setSecondsLeft(ttl)
            },
        })
    }

    // 6) Redirect on success
    useEffect(() => {
        if (verifyOtpMutation.isSuccess) {
            if (isResetPass) navigate('/reset-password', { replace: true })
            else if (isSignedUp) navigate('/login', { replace: true })
        }
    }, [verifyOtpMutation.isSuccess, isResetPass, isSignedUp, navigate])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
                <div className="text-center mb-6">
                    <Title level={3}>Verify OTP</Title>
                    <Text type="secondary">
                        We sent a code to your registered email.
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
                            {
                                pattern: /^\d{6}$/,
                                message: 'OTP must be a 6-digit number',
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
                    {ttlLoading ? (
                        <Text type="secondary">Checking timer…</Text>
                    ) : resendDisabled && secondsLeft > 0 ? (
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
