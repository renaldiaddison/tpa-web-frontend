import { Route, Routes } from "react-router-dom";
import AccountVerificationPage from "./pages/AccountVerificationPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/:id" element={<AccountVerificationPage />}></Route>
      <Route path="/home" element={<HomePage />}></Route>

    </Routes>
  );
}

export default App;
