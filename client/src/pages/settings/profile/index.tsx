import PageHeaderBlock from '@/components/layouts/page-header-block'
import ProfilePage from '@/features/settings/profile/profile'

const ProfileIndexPage = () => {
    return (
        <PageHeaderBlock
            title="Profile"
            description="Welcome to your profile! Here you can view and edit your profile and manage your account."
            breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Profile', path: '/settings/profile' },
            ]}
        >
            <ProfilePage />
        </PageHeaderBlock>
    )
}

export default ProfileIndexPage
