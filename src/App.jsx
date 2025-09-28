// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout & Pages
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";

// 🔒 Protected route wrapper
function Protected() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loader while Firebase checks session
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Private Routes (require login) */}
        <Route element={<Protected />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="discover" element={<Discover />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 🚧 Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
