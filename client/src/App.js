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
import Classes from "./pages/ClassesDashboard/Classes";
import { useAuth } from "./hooks/useAuth";
import GroupInvite from "./pages/GroupInvite/GroupInvite";
import EmailInvite from "./pages/EmailInvite/EmailInvite";
import AssignmentTeacher from "./pages/AssignmentTeacher/AssignmentTeacher";
import AssignmentStudent from "./pages/AssignmentStudent/AssignmentStudent";

function App() {
  const { user } = useAuth();
  console.log(user);
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

          <Route path="classes" element={<ClassesDashboard />}>
            <Route index element={<Classes />} />
            <Route exact path=":classId" element={<ClassInfo />} />
            <Route
              path=":classId/assignment/:assignmentId/teacher"
              element={<AssignmentTeacher />}
            />
            <Route
              path=":classId/assignment/:assignmentId/student"
              element={<AssignmentStudent />}
            />
          </Route>

          <Route path="profile" element={<Profile />} />
          <Route path="group-invite" element={<GroupInvite />} />
          <Route path="invite" element={<EmailInvite />} />
        </Route>
        {/**Only teacher can access to these routes */}
        <Route
          element={
            <ProtectedLayout
              isAllowed={!!user && user.role === "teacher"}
              redirectPath="/home"
            />
          }
        >
          <Route path="classes/addClass" element={<CreateClass />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
