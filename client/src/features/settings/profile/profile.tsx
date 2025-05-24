import { useDisable2FA, useGenerate2FA, useVerify2FA } from '@/hooks/use2fa'
import useAuthStore from '@/stores/useAuthStore'
import {
    CheckCircleFilled,
    CloseCircleFilled,
    EditOutlined,
    SaveOutlined,
    SecurityScanFilled,
} from '@ant-design/icons'
import {
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Spin,
    Steps,
    Tag,
    Typography,
    message,
} from 'antd'
import { useEffect, useState } from 'react'

const { Title, Text } = Typography

const ProfilePage = () => {
    const { user, isAuthenticated, token, login } = useAuthStore()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileForm] = Form.useForm()

    // Change Password modal state
    const [isPwdModalVisible, setPwdModalVisible] = useState(false)
    const [pwdForm] = Form.useForm()

    // 2fa functions
    const gen2FA = useGenerate2FA()
    const verify2FA = useVerify2FA()
    const disable2FA = useDisable2FA()
    const [twoFAForm] = Form.useForm()
    const setup = gen2FA.data

    // Prefill form when user loads
    useEffect(() => {
        if (user) {
            profileForm.setFieldsValue({ name: user.name, email: user.email })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Title level={2} type="warning">
                    401 Unauthorized
                </Title>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        )
    }

    const onEdit = () => setIsEditing(true)

    const onCancel = () => {
        setIsEditing(false)
        profileForm.resetFields()
        profileForm.setFieldsValue({ name: user.name, email: user.email })
    }

    const onSubmit = async (values: any) => {
        setLoading(true)
        try {
            // TODO: call your updateProfile API
            // e.g. await api.put('/api/users/me', values)
            message.success('Profile updated successfully')
            // update store so UI reflects new name/email
            login(token!, { ...user, name: values.name, email: values.email })
            setIsEditing(false)
        } catch (err: any) {
            message.error(err.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const onChangePassword = async (values: any) => {
        console.log('PWD::', values)
        try {
            // TODO: call change-password API, e.g. await api.post('/api/auth/change-password', values)
            message.success('Password changed successfully')
            setPwdModalVisible(false)
            pwdForm.resetFields()
        } catch (err: any) {
            message.error(err.message || 'Failed to change password')
        }
    }

    const handleDisable2FA = async () => {
        try {
            await disable2FA.mutateAsync()
            message.success('Two-factor authentication has been disabled')
        } catch (error: any) {
            message.error('Failed to disable 2FA' + error.message)
        }
    }

    return (
        <div className="max-w-full mx-auto">
            {/* Profile Header */}
            <div
                className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative z-[1] rounded-t-xl flex items-center justify-start px-8 -mb-2"
                style={{
                    background:
                        'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                }}
            >
                <div className="absolute -bottom-16 left-8">
                    <Badge
                        count={
                            user.emailVerified ? (
                                <CheckCircleFilled
                                    style={{
                                        color: '#52c41a',
                                        fontSize: 24,
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                    }}
                                />
                            ) : (
                                <CloseCircleFilled
                                    style={{
                                        color: '#52c41a',
                                        fontSize: 24,
                                    }}
                                />
                            )
                        }
                        offset={[-10, 80]}
                    >
                        {user.name && (
                            <Avatar
                                size={120}
                                style={{
                                    backgroundColor: '#4f46e5',
                                    color: '#fff',
                                    border: '4px solid white',
                                }}
                                className="border-4 border-white shadow-lg uppercase "
                            >
                                <div className="text-7xl text-white flex items-center justify-center h-full w-full">
                                    {user.name.charAt(0)}
                                </div>
                            </Avatar>
                        )}
                    </Badge>
                </div>
            </div>
            <Card className="shadow-xl rounded-xl border-0">
                <div className="pt-20 px-8 pb-8">
                    <Row gutter={[24, 24]}>
                        {/* Left Column - Profile Info */}
                        <Col xs={24} md={24} xl={14}>
                            <div className="flex flex-wrap justify-between items-start mb-6">
                                <div>
                                    <Title level={3} className="mb-1">
                                        {user.name}
                                    </Title>
                                    <Text
                                        type="secondary"
                                        className="text-lg mr-2"
                                    >
                                        {user.email}
                                    </Text>

                                    {user.emailVerified && (
                                        <Tag
                                            icon={<CheckCircleFilled />}
                                            color="success"
                                            className="ml-2"
                                        >
                                            Verified
                                        </Tag>
                                    )}
                                    {user.googleAuthEnabled && (
                                        <Tag
                                            icon={<SecurityScanFilled />}
                                            color="blue"
                                            className="ml-2"
                                        >
                                            2FA Enabled
                                        </Tag>
                                    )}
                                </div>
                                {!isEditing ? (
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={onEdit}
                                        size="large"
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Space>
                                        <Button onClick={onCancel} size="large">
                                            Cancel
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<SaveOutlined />}
                                            loading={loading}
                                            onClick={() => profileForm.submit()}
                                            size="large"
                                        >
                                            Save Changes
                                        </Button>
                                    </Space>
                                )}
                            </div>

                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={onSubmit}
                                initialValues={{
                                    name: user.name,
                                    email: user.email,
                                }}
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Full Name"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter your name',
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={!isEditing}
                                                size="large"
                                                className="rounded-lg"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Email Address"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter your email',
                                                },
                                                {
                                                    type: 'email',
                                                    message:
                                                        'Invalid email address',
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={!isEditing}
                                                size="large"
                                                className="rounded-lg"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>

                            {/* Password Section */}
                            <Card
                                title={
                                    <div className="flex items-center">
                                        <SecurityScanFilled className="mr-2 text-primary" />
                                        <span>Password</span>
                                    </div>
                                }
                                className="shadow-sm rounded-lg mb-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Title level={5} className="mb-1">
                                            Password
                                        </Title>
                                        <Text type="secondary">
                                            Last changed: 3 months ago
                                        </Text>
                                    </div>
                                    <Button
                                        onClick={() => setPwdModalVisible(true)}
                                        size="middle"
                                    >
                                        Change Password
                                    </Button>
                                </div>
                            </Card>
                        </Col>

                        {/* Right Column - 2FA Section */}
                        <Col xs={24} md={24} xl={10}>
                            <Card
                                title={
                                    <div className="flex items-center">
                                        <SecurityScanFilled className="mr-2 text-primary" />
                                        <span>Two-Factor Authentication</span>
                                    </div>
                                }
                                className="shadow-sm rounded-lg"
                            >
                                {user.googleAuthEnabled ? (
                                    <div className="space-y-4">
                                        <Alert
                                            message={
                                                <div className="flex items-center">
                                                    <CheckCircleFilled className="text-success mr-2" />
                                                    <span>
                                                        2FA is currently enabled
                                                    </span>
                                                </div>
                                            }
                                            type="success"
                                            showIcon={false}
                                            className="border-0 bg-green-50"
                                        />
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <Text className="block mb-2 font-medium">
                                                Two-factor authentication adds
                                                an extra layer of security to
                                                your account.
                                            </Text>
                                            <Text
                                                type="secondary"
                                                className="block"
                                            >
                                                You'll need both your password
                                                and an authentication code to
                                                log in.
                                            </Text>
                                        </div>
                                        <Button
                                            danger
                                            loading={disable2FA.isPending}
                                            onClick={handleDisable2FA}
                                            block
                                            size="large"
                                            className="mt-4"
                                        >
                                            Disable Two-Factor Authentication
                                        </Button>
                                    </div>
                                ) : !setup ? (
                                    <div className="space-y-6">
                                        <Steps
                                            direction="vertical"
                                            current={0}
                                            items={[
                                                {
                                                    title: 'Enable 2FA',
                                                    description:
                                                        'Add an extra layer of security',
                                                },
                                                {
                                                    title: 'Scan QR Code',
                                                    description:
                                                        'Using authenticator app',
                                                },
                                                {
                                                    title: 'Enter Code',
                                                    description: 'Verify setup',
                                                },
                                            ]}
                                        />
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <Text className="block mb-2 font-medium">
                                                Protect your account with
                                                two-factor authentication
                                            </Text>
                                            <Text
                                                type="secondary"
                                                className="block"
                                            >
                                                You'll need an authenticator app
                                                like Google Authenticator or
                                                Authy.
                                            </Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            loading={gen2FA.isPending}
                                            onClick={() => gen2FA.mutate()}
                                            block
                                            size="large"
                                        >
                                            Set Up Two-Factor Authentication
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <Steps
                                            direction="vertical"
                                            current={1}
                                            items={[
                                                {
                                                    title: 'Enabled',
                                                    status: 'finish',
                                                },
                                                {
                                                    title: 'Scan QR Code',
                                                    description:
                                                        'Using authenticator app',
                                                    status: 'process',
                                                },
                                                {
                                                    title: 'Verify',
                                                    description:
                                                        'Complete setup',
                                                },
                                            ]}
                                        />
                                        <Alert
                                            message="Scan this QR code with your authenticator app"
                                            type="info"
                                            showIcon
                                            className="bg-blue-50 border-0"
                                        />
                                        <div className="text-center mt-2">
                                            {gen2FA.isPending ? (
                                                <Spin />
                                            ) : (
                                                <img
                                                    src={setup.qrCode}
                                                    alt="2FA QR"
                                                    className="mx-auto border rounded-lg p-2 bg-white"
                                                />
                                            )}
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <Text className="block mb-2 font-medium">
                                                Can't scan the QR code?
                                            </Text>
                                            <Text
                                                type="secondary"
                                                className="block mb-2"
                                            >
                                                Enter this secret key manually:
                                            </Text>
                                            <Text
                                                copyable
                                                code
                                                className="block text-center p-2 bg-white rounded-lg"
                                            >
                                                {setup.secret}
                                            </Text>
                                        </div>
                                        <Form
                                            form={twoFAForm}
                                            layout="vertical"
                                            onFinish={({ code }) =>
                                                verify2FA.mutate(code)
                                            }
                                        >
                                            <Form.Item
                                                name="code"
                                                label="Enter 6-digit verification code"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please enter the 6-digit code',
                                                    },
                                                    {
                                                        pattern: /^\d{6}$/,
                                                        message:
                                                            'Must be exactly 6 digits',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    maxLength={6}
                                                    placeholder="123456"
                                                    size="large"
                                                    className="text-center text-xl"
                                                />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button
                                                    type="primary"
                                                    block
                                                    loading={
                                                        verify2FA.isPending
                                                    }
                                                    htmlType="submit"
                                                    size="large"
                                                >
                                                    Verify & Enable 2FA
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* Change Password Modal */}
            <Modal
                title={
                    <span className="text-lg font-semibold">
                        Change Password
                    </span>
                }
                open={isPwdModalVisible}
                onCancel={() => setPwdModalVisible(false)}
                footer={null}
                maskClosable={false}
                centered
                width={480}
            >
                <Form
                    form={pwdForm}
                    layout="vertical"
                    onFinish={onChangePassword}
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Enter current password',
                            },
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Enter new password' },
                            {
                                min: 8,
                                message:
                                    'Password must be at least 8 characters',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Confirm new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue('newPassword') === value
                                    ) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(
                                        'Passwords do not match'
                                    )
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>
                    <Form.Item className="mt-8">
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ProfilePage
