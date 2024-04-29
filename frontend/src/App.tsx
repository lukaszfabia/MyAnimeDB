import {
  BrowserRouter as Router,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import LoginForm from "./pages/login";
import RegisterForm from "./pages/register";
import NoPage from "./pages/NotFoundPage";
import CustomNavbar from "./pages/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import React, { useEffect, useState } from "react";
import Logout from "./pages/Logout";
import Anime from "./pages/Anime";
import api from "./scripts/api";
import { ACCESS_TOKEN } from "./constants/const";
import { UserProvider } from "./UserProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <CustomNavbar />
        <Home />
      </>
    ),
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: (
      <>
        <CustomNavbar />
        <UserProvider>
          <LoginForm />
        </UserProvider>
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <CustomNavbar />
        <RegisterForm />
      </>
    ),
  },
  {
    path: "/tajnastrona",
    element: (
      <ProtectedRoute>
        <div>
          <h1 className="text-white">tejna storna</h1>
        </div>
        ,
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:name",
    element: (
      <>
        <CustomNavbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/anime/:id",
    element: <Anime />,
  },
  {
    path: "*",
    element: <NoPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default function App() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  console.log(isLogged);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      console.log("token found");
      localStorage.setItem("isLogged", "true");
      api.get("api/user-data/").then((response) => {
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("avatar", response.data.avatar);
        localStorage.setItem("bio", response.data.bio);
      });
      setIsLogged(true);
    }
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
