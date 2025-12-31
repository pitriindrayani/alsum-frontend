import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("token_expiry");

  const isExpired = !expiry || new Date().getTime() > expiry;

  if (!token || isExpired) {
    localStorage.clear();
    return <Navigate to="/1337" replace />;
  }

  return <Outlet />;
}

