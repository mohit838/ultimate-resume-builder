import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
  const handleReset = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      console.log("Reset payload:", values);
      // API integration here
      message.success("Password reset successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Failed to reset password.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-xl border-none rounded-lg">
        <div className="text-center mb-6">
          <Title level={2}>Reset Your Password</Title>
          <Text type="secondary">Please enter a new password below</Text>
        </div>

        <Form layout="vertical" onFinish={handleReset}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
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
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("password") === value
                    ? Promise.resolve()
                    : Promise.reject("Passwords do not match");
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
            <Button type="primary" htmlType="submit" size="large" block>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
