import useAuthStore from "../../../store/auth-store";

const ProfilePage = () => {
  const { isAuthenticated, token, logout } = useAuthStore();

  console.log(token);

  return (
    <div>
      <p>Status: {isAuthenticated ? "Logged in" : "Logged out"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
