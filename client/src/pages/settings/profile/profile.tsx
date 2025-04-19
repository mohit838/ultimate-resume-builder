import useAuthStore from '../../../stores/useAuthStore'

const ProfilePage = () => {
    const { isAuthenticated } = useAuthStore()

    return (
        <div>
            <h1 className="text-2xl font-bold">Profile Page</h1>
            {isAuthenticated ? (
                <div>
                    <p>Welcome to your profile!</p>

                    <p>Here you can view and edit your profile information.</p>
                </div>
            ) : (
                <p>401</p>
            )}
        </div>
    )
}

export default ProfilePage
