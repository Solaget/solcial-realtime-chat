// Api 👇🏼
import { useLogoutMutation } from "@/api/services/auth.service";

const LogoutHandler = ({ children }) => {
  const [logoutUser, { isLoading: isLogingOut }] = useLogoutMutation();
  const handleLogout = async () => {
    await logoutUser();
  };
  
  return (
    <button onClick={handleLogout} disabled={isLogingOut}>
      {children}
    </button>
  );
};

export default LogoutHandler;
