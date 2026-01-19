import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "./AuthContext/AuthProvider";
import LoadinPage from "./LoadinPage";

function PrivateRoute() {
  const auth = useContext(authContext);

  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) {
    return <LoadinPage />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
