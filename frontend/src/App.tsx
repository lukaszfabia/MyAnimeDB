import { BrowserRouter as Router, Route, Routes, RouterProvider, createBrowserRouter } from 'react-router-dom'
import "./App.css";
import Home from "../src/pages/Home";
import React, { useState } from "react";
import LoginForm from "./pages/login";
import RegisterForm from "./pages/register";
import Profile from "./pages/Profile";
import Anime from "./pages/Anime";
import CustomNavbar from './pages/Navigation';
import { AuthProvider } from './context/AuthProvider';
import NoPage from './pages/NotFoundPage';
import Logout from './pages/Logout';

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
    path: "/profile/:username",
    element: <Profile />,
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
    element: <Logout />
  }
]);


export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}