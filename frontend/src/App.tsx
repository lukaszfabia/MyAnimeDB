import { BrowserRouter as Router, Route, Routes, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from 'react-router-dom'
import "./App.css";
import Home from "../src/pages/Home";
import LoginForm from "./pages/login";
import RegisterForm from "./pages/register";
import NoPage from './pages/NotFoundPage';
import CustomNavbar from './pages/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import React from 'react';
import Logout from './pages/Logout';
import Anime from './pages/Anime';

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <CustomNavbar />
      <Home />
    </>,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: <>
      <CustomNavbar />
      <LoginForm />
    </>,
  },
  {
    path: "/register",
    element: <>
      <CustomNavbar />
      <RegisterForm /></>,
  },
  {
    path: "/search",
    element: <div>search</div>,
  },
  {
    path: "/profile/:username",
    element: <>
      <CustomNavbar />
      <Profile />
    </>,
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



// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<Home />}>
//       <Route path="/login" element={<LoginForm />} />
//       <Route path="/register" element={<RegisterForm />} />
//       <Route path="/profile/:username" element={<Profile />} />
//       <Route path="*" element={<NoPage />} />
//     </Route>
//   )
// );

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
