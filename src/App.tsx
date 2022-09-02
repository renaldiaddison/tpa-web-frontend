import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthContext from "./lib/UserContext";
import UserContext from "./lib/UserContext";
import ProtectedRoute, { UnprotectedRoute } from "./middleware/Middleware";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const Protected = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

const Unprotected = () => {
  return (
    <UnprotectedRoute>
      <Outlet />
    </UnprotectedRoute>
  );
};

function App() {
  return (
    <AuthContext>
      <Toaster position="bottom-left" />
      <Routes>
        <Route element={<Unprotected />}>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/activate-account/:id" element={<AccountVerificationPage />}></Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
          <Route path="/reset-password/:id" element={<ResetPasswordPage />}></Route>
        </Route>
        <Route element={<Protected />}>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/profile/:id" element={<ProfilePage />}></Route>
        </Route>
        {/* <Route path="/PageNotFound" element={<ErrorPage errorCode ="404" errorDefinition = "Page Not Found"></ErrorPage>}></Route>
        <Route path="*" element={<Navigate to="/PageNotFound"></Navigate>}></Route> */}
        <Route path="*" element={<ErrorPage errorCode="404" errorDefinition="Page Not Found"></ErrorPage>}></Route>
      </Routes>
    </AuthContext>
  );
}

export default App;
