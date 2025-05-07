import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Write from "../pages/Write";
import Profile from "../pages/Profile";
import Dashboard from "../pages/admin/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Landing from "../components/Landing";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas para usuarios normales */}
      <Route
        path="/"
        element={<Landing/>}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute role="USER">
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/write"
        element={
          <ProtectedRoute role="USER">
            <Write />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute role="USER">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para administradores */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}; 