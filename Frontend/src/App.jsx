import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthLayout from "./Components/auth/AuthLayout";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import VerifyOTP from "./Pages/auth/VerifyOTP";
import ResetPassword from "./Pages/auth/ResetPassword";
import Homepage from "./Pages/Homepage";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route path="/home-page" element={<Homepage />} />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#ffffff",
            color: "#111827",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </>
  );
};

export default App;
