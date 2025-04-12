import useAuthStore from "@/store/auth-store";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      console.log("Login input:", values);

      // Replace with actual API login
      const token = "dummy-token";
      login(token);

      message.success("Login successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message);
      } else {
        message.error("Login failed");
      }
    }
  };

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
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
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
            rules={[{ required: true, message: "Please enter your password" }]}
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
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
