import { lazy } from "react";

// Lib 👇🏼
import { useSelector } from "react-redux";
import { Navigate, useRoutes } from "react-router-dom";

// Importing All Pages Using Lazy Loader for good performance 👇🏼
const Signup = lazy(() => import("@/pages/Signup/signup-page"));
const HomePage = lazy(() => import("@/pages/Home/home-page"));
const Login = lazy(() => import("@/pages/Login/login-page"));
const ChatPage = lazy(() => import("@/pages/Chat/chat-page"));
const ThemePage = lazy(() => import("@/pages/Theme/theme-page"));
const ProfilePage = lazy(() => import("@/pages/Profile/profile-page"));
const PrivacyAndSecurityPage = lazy(() =>
  import("@/pages/PrivacyAndSecurity/privacyAndSecurityPage")
);

// All Layouts 👇🏼
import MainLayout from "@/layouts/main-layout";
import PublicLayout from "@/layouts/public-layout";
import SettingsLayout from "@/layouts/setting-layout";

const Routes = () => {
  const { isLogedin } = useSelector((state) => state.auth);
  return useRoutes([
    {
      element: <PublicLayout />,
      children: [
        {
          element: <HomePage />,
          path: "/",
        },
        {
          element: isLogedin ? <Navigate to="/chat" /> : <Signup />,
          path: "/signup",
        },
        {
          element: isLogedin ? <Navigate to="/chat" /> : <Login />,
          path: "/login",
        },
      ],
    },

    {
      element: <MainLayout />,
      children: [
        {
          element: isLogedin ? <ChatPage /> : <Navigate to="/" />,
          path: "/chat",
        },
        {
          element: <SettingsLayout />,
          path: "/setting",
          children: [
            {
              element: isLogedin ? <ProfilePage /> : <Navigate to="/" />,
              path: "profile",
              exact: true,
            },
            {
              element: isLogedin ? <ThemePage /> : <Navigate to="/" />,
              path: "theme",
              exact: true,
            },
            {
              element: isLogedin ? (
                <PrivacyAndSecurityPage />
              ) : (
                <Navigate to="/" />
              ),
              path: "privacy-security",
              exact: true,
            },
          ],
        },
      ],
    },
  ]);
};

export default Routes;
