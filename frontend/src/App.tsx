import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/register";
import NoPage from "./pages/NotFoundPage";
import CustomNavbar from "./pages/Navigation";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Anime from "./pages/Anime";
import { AuthProvider } from "./components/context/AuthContext";

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
      <AuthProvider>
        <CustomNavbar />
        <LoginForm />
      </AuthProvider>
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
      <AuthProvider>
        <CustomNavbar />
        <Profile />
      </AuthProvider>
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
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
