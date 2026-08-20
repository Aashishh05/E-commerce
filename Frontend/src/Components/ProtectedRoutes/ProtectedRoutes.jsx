import { getToken } from "../../Localstorage/storage";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = getToken();

  console.log("TOKEN FROM getToken():", token);
  console.log("TOKEN DIRECTLY:", localStorage.getItem("token"));

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
