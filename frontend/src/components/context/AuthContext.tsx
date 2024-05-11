import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/const";
import api from "../../scripts/api";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  login: (e: any, rememberMe: boolean) => Promise<void>;
  register: (e: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(ACCESS_TOKEN)
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    Cookies.get(REFRESH_TOKEN) || null
  );
  const navigate = useNavigate();

  const register = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("user.username", e.target.username.value);
    formData.append("user.email", e.target.email.value);
    formData.append("user.password", e.target.password.value);
    if (e.target.avatar.files[0] !== null) {
      formData.append("avatar", e.target.avatar.files[0]);
    } else {
      formData.append("avatar", "media/avatars/def.png");
    }
    formData.append("bio", "change me");

    await api
      .post("/api/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        login(e, false);
      })
      .catch((error) => {
        console.log(error);
        alert("username already exists");
        window.location.reload();
      });
  };

  const login = async (e: any, rememberMe: boolean) => {
    e.preventDefault();
    const response = await api.post("/api/token/", {
      username: e.target.username.value,
      password: e.target.password.value,
    });

    if (response.status !== 200) {
      alert("Invalid credentials");
      return;
    } else {
      if (rememberMe) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("username", e.target.username.value);
      } else {
        sessionStorage.setItem(ACCESS_TOKEN, response.data.access);
        sessionStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        sessionStorage.setItem("isLogged", "true");
        sessionStorage.setItem("username", e.target.username.value);
      }
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      navigate(`/profile/${e.target.username.value}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};