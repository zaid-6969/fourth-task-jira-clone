import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./styles/app.scss";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminRoute from "./auth/AdminRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";
import SpacesList from "./pages/SpacesList";
import Spaces from "./pages/Spaces";
import Star from "./pages/Star";
import Creationmodule from "./components/Creationmodule";
// import ImageUpload from "./components/ImageUpload";

const App = () => {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const showModule = useSelector((state) => state.module.showModule);
  return (
    <>
      <div
        style={{ display: showModule ? "flex" : "none" }}
        className="creation-module"
      >
        <Creationmodule />
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/image" element={<ImageUpload/>}/> */}
        <Route element={<MainLayout />}>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          <Route
            path="/homeuser"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/spaces"
            element={
              <ProtectedRoute>
                <SpacesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/spaces/:projectId"
            element={
              <ProtectedRoute>
                <Spaces />
              </ProtectedRoute>
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Star />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
