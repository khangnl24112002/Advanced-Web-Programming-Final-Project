import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ProtectedLayout from "./layouts/ProtectedLayout/ProtectedLayout";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";
import LandingPage from "./pages/Landing Page/LandingPage";
import Home from "./pages/Home/Home";
import ClassesDashboard from "./pages/ClassesDashboard/ClassesDashboard";
import ClassInfo from "./pages/ClassInfo/ClassInfo";
import Stats from "./pages/Stats/Stats";
import "./styles/app.sass";
import AuthLayout from "./layouts/Auth/AuthLayout";
import OAuthRedirect from "./pages/OAuthRedirect/OAuthRedirect";
import CreateClass from "./pages/CreateClass/CreateClass";
import { useAuth } from "./hooks/useAuth";
function App() {
  const { user, token } = useAuth();
  return (
    <div className="App">
      <Routes>
        {/** All user can access to these routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="" element={<Navigate to="sign-in" />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" index element={<SignIn />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="oauth-redirect" element={<OAuthRedirect />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        {/** All user logged in can access to these routes */}
        <Route
          element={
            <ProtectedLayout isAllowed={!!user} redirectPath="/auth/sign-in" />
          }
        >
          <Route path="home" index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="classes/addClass" element={<CreateClass />} />
          <Route path="classes/:classId" element={<ClassInfo />} />
          <Route path="classes" element={<ClassesDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="stats" element={<Stats />} />
        </Route>
        {/**Only teacher can access to these routes */}
      </Routes>
    </div>
  );
}

export default App;
