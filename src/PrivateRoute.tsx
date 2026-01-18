import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { authContext } from "./AuthContext/AuthProvider";

function PrivateRoute() {
  const auth = useContext(authContext);

  if (!auth) return null; 

  const { user, loading } = auth;

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;