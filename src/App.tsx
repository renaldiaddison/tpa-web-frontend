import { Outlet, Route, Routes } from "react-router-dom";
import UserContext from "./lib/UserContext";
import ProtectedRoute from "./middleware/ProtectedRoute";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const Protected = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

function App() {
  return (
    // <UserContext>
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/:id" element={<AccountVerificationPage />}></Route>
      <Route element={<Protected />}>
        <Route path="/home" element={<HomePage />}></Route>
      </Route>
    </Routes>
    // </UserContext>
  );
}

export default App;
