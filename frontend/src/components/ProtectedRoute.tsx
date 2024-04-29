import { Navigate } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
import api from "../scripts/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants/const";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded: JwtPayload = jwtDecode(token);
    const expire = decoded.exp as number;
    const now = Date.now() / 1000;

    if (expire < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  console.log("is auth " + isAuthorized);
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
