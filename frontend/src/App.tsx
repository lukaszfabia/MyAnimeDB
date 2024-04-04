import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Home from "../src/home/Home";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: <div>Login</div>,
  },
  {
    path: "/register",
    element: <div>Register</div>,
  },
  {
    path: "/search",
    element: <div>search</div>,
  },
  {
    path: "/profile",
    element: <div>profile</div>,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
