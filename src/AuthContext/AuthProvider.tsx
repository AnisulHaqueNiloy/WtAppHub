import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: null | { [key: string]: unknown };
  loading: boolean;
  logout: () => Promise<void>;
}

export const authContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | { [key: string]: unknown }>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Check authentication on load
  const checkAuth = async () => {
    try {
      const res = await axios.get(
        "https://api.wtapphub.com/api/auth/me",
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (err) {
      setUser(null);
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Global 401 interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  // ✅ Logout
  const logout = async () => {
    await axios.post(
      "https://api.wtapphub.com/api/auth/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <authContext.Provider value={{ user, loading, logout }}>
      { children}
    </authContext.Provider>
  );
};

export default AuthProvider;
