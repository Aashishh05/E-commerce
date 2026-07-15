import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthLayout from "./Components/auth/AuthLayout";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import VerifyOTP from "./Pages/auth/VerifyOTP";
import ResetPassword from "./Pages/auth/ResetPassword";
import Homepage from "./Pages/Homepage";
import SellerDashboard from "./Pages/Seller/Sellerdashboard";
import SellerLayout from "./Components/Seller/SellerLayout";
import CategoryForm from "./Pages/Seller/Categoryform";
import CategoryList from "./Pages/Seller/CategoryList";
import ProductForm from "./Pages/Seller/Productform";
import ProductList from "./Pages/Seller/Productlist";
import OrderList from "./Pages/Seller/OrderList";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminSellers from "./Pages/Admin/Adminsellers";
import AdminUsers from "./Pages/Admin/Adminusers";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminCategories from "./Pages/Admin/AdminCategories";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Homepage />} />

        <Route element={<AdminLayout />} >
        <Route path="/admin/sellers" element={<AdminSellers />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<SellerLayout />}>
          <Route path="/category-form" element={<CategoryForm />} />
          <Route path="/category-list" element={<CategoryList />} />
          <Route path="/product-form" element={<ProductForm />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/order-list" element={<OrderList />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
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
