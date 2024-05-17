import { jwtDecode } from "jwt-decode";
import api from "../../scripts/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants/const";
import React, { useState, useEffect } from "react";

const refreshToken = async (): Promise<boolean> => {
  let refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (!refreshToken) {
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
  }

  if (!refreshToken) return false;

  try {
    const res = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    if (res.status === 200) {
      const accessToken = res.data.access;
      if (sessionStorage.getItem(REFRESH_TOKEN)) {
        sessionStorage.setItem(ACCESS_TOKEN, accessToken);
      } else {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
      }
      return true;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
  }
  return false;
};

const auth = async (): Promise<boolean> => {
  const token =
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
  if (token) {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp > currentTime) {
      return true;
    } else {
      return await refreshToken();
    }
  } else {
    return await refreshToken();
  }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  error: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, error }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await auth();
      setIsAuth(result);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuth ? children : error;
};

export default ProtectedRoute;