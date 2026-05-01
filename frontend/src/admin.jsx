import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import api from './utils/api';
import './index.css';

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await api.get('/api/me');
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    verifySession();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-xl bg-gray-50">Verifying secure session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// --- Minimal Auth Layout Wrapper ---
const MinimalAuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

const AdminApp = () => {
  return (
    // Base path matches the subfolder + the route
    <BrowserRouter basename="/immihire-cms/immi-admin">
      <Routes>
        <Route path="/login" element={<MinimalAuthLayout><Login /></MinimalAuthLayout>} />
        <Route path="/forgot-password" element={<MinimalAuthLayout><ForgotPassword /></MinimalAuthLayout>} />
        <Route path="/reset-password" element={<MinimalAuthLayout><ResetPassword /></MinimalAuthLayout>} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
