import { jwtDecode } from "jwt-decode";
import api from "../../scripts/api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants/const";
import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

/**
 * Refreshes the access token using the refresh token stored in local storage or session storage.
 * @returns A promise that resolves to a boolean indicating whether the token was successfully refreshed.
 */
const refreshToken = async (): Promise<boolean> => {
  let refreshToken = localStorage.getItem(REFRESH_TOKEN);

  if (!refreshToken) {
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
  }

  if (!refreshToken) return false;

  api.post("/api/auth/token/refresh/", {
    refresh: refreshToken,
  })
    .then((res) => {
      if (res.status === 200) {
        const accessToken = res.data.access;
        if (sessionStorage.getItem(REFRESH_TOKEN)) {
          sessionStorage.setItem(ACCESS_TOKEN, accessToken);
        } else {
          localStorage.setItem(ACCESS_TOKEN, accessToken);
        }
        return true;
      }
    })
    .catch((error) => {
      console.log("Error refreshing token:", error);
    });

  return false;
}

/**
 * Checks if the user is authenticated by verifying the token's expiration time.
 * If the token is valid, returns true. Otherwise, attempts to refresh the token.
 * @returns A Promise that resolves to a boolean indicating whether the user is authenticated.
 */
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

/**
 * A protected route component that renders the specified children if the user is authenticated,
 * otherwise renders the specified error component.
 *
 * @param children - The component(s) to render if the user is authenticated.
 * @param error - The component to render if the user is not authenticated.
 */
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
    return <Spinner animation="border" />;
  }

  return isAuth ? children : error;
};

export default ProtectedRoute;