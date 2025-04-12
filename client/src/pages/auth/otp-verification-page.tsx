import { Button, Card, Form, Input, Typography, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email;

  const [form] = Form.useForm();
  const [resendDisabled, setResendDisabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  const handleVerifyOtp = async ({ otp }: { otp: string }) => {
    try {
      // call backend API
      console.log("Verifying OTP for", email, "with code", otp);
      message.success("OTP verified! Proceed to reset password.");
      navigate("/reset-password", { state: { email } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Invalid OTP or expired.");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log("Resending OTP to", email);
      // API: send again
      setResendDisabled(true);
      setSecondsLeft(180);
      message.success("OTP sent again to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Failed to resend OTP.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
        <div className="text-center mb-6">
          <Title level={3}>Verify OTP</Title>
          <Text type="secondary">
            We sent a code to your email: <strong>{email}</strong>
          </Text>
        </div>

        <Form layout="vertical" form={form} onFinish={handleVerifyOtp}>
          <Form.Item
            name="otp"
            label="Enter OTP"
            rules={[{ required: true, message: "Please enter the OTP code" }]}
          >
            <Input maxLength={6} placeholder="Enter 6-digit code" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Verify OTP
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm mt-4">
          {resendDisabled ? (
            <Text type="secondary">You can resend code in {secondsLeft}s</Text>
          ) : (
            <Button type="link" onClick={handleResendOtp}>
              Resend OTP
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OtpVerificationPage;
