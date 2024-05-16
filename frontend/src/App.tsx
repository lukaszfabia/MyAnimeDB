import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/register";
import NoPage from "./pages/NotFoundPage";
import CustomNavbar from "./pages/Navigation";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Anime from "./pages/Anime";
import SearchAnime from "./pages/SearchAnime";
import Settings from "./pages/Settings";
import PrivateRoute from "./components/context/PrivateRoute";
import ProtectedRoute from "./components/context/PrivateRoute";

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
        <LoginForm />
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
    path: "/profile/:name",
    element: (
      <PrivateRoute>
        <CustomNavbar />
        <Profile />
      </PrivateRoute>
    ),
  }, {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <CustomNavbar />
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:name",
    element: (
      <>
        <CustomNavbar />
        <Profile />
      </>
    ),
  },
  {
    path: "/anime/:id",
    element: (
      <>
        <CustomNavbar />
        <Anime />,
      </>
    ),
  },
  {
    path: "*",
    element: <NoPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/search",
    children: [
      {
        path: "anime",
        element: (
          <>
            <CustomNavbar />
            <SearchAnime />
          </>
        ),
      },
      {
        path: "manga",
        element: <h1>Search Manga</h1>,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
