import { Route, Routes } from "react-router-dom";
import AuthLayout from "./Components/auth/AuthLayout";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import VerifyOTP from "./Pages/auth/VerifyOTP";
import ResetPassword from "./Pages/auth/ResetPassword";

const App = () => {
  return (
    <Routes>

      <Route element={<AuthLayout />}>

        <Route index element={<Register />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Route>

    </Routes>
  );
};

export default App;