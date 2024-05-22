import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home";
import LoginForm from "./pages/Login";
import RegisterForm from "./pages/Register";
import NoPage from "./pages/NotFoundPage";
import CustomNavbar from "./pages/Navigation";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Anime from "./pages/Anime";
import SearchAnime from "./pages/SearchAnime";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/context/PrivateRoute";
import Footer from "./components/Footer";
import MyList from "./pages/MyList";
import RestoringPassword from "./pages/RestoringPassword";
import ResetPassword from "./pages/ResetPassword";

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
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <CustomNavbar />
        <RegisterForm />
        <Footer />
      </>
    ),
  },
  {
    path: "/profile/:name",
    element: (
      <ProtectedRoute error={<Navigate to="/login" />}>
        <CustomNavbar />
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile/:name/myanime",
    element: (
      <ProtectedRoute error={<Navigate to="/login" />}>
        <CustomNavbar />
        <MyList />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:name/reviews",
    element: (
      <ProtectedRoute error={<Navigate to="/login" />}>
        <CustomNavbar />
        <MyList />
        <Footer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:name/settings",
    element: (
      <ProtectedRoute error={<Navigate to="/login" />}>
        <CustomNavbar />
        <Settings />
        <Footer />
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
            <Footer />
          </>
        ),
      },
      {
        path: "manga",
        element: <h1>Search Manga</h1>,
      },
    ],
  }, {
    path: "/login/forgot-password",
    element: <>
      <CustomNavbar />
      <RestoringPassword />
      <Footer />
    </>,
  }, {
    path: "/login/forgot-password/:uid/:token",
    element: <>
      <CustomNavbar />
      <ResetPassword />
      <Footer />
    </>,
  },
  {
    path: "*",
    element: <>
      <CustomNavbar />
      <NoPage />
    </>,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
