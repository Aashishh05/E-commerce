import { Navigate, Outlet } from "react-router-dom";
import { getToken, getUser } from "../../Localstorage/storage";

const RoleProtectedRoutes = ({ allowedRoles }) => {
  const token = getToken();
  const user = getUser();

  console.log("USER:", user);
  console.log("ROLE:", user?.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    if (user?.role === "seller") {
      return <Navigate to="/seller-dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoutes;
