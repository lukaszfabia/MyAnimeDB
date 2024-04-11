import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "../src/home/Home";
import React from "react";
import LoginForm from "./components/forms/login";
import RegisterForm from "./components/forms/register";
import Profile from "./display/Profile";
import Anime from "./display/Anime";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/search",
    element: <div>search</div>,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/anime/:id",
    element: <Anime />,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
