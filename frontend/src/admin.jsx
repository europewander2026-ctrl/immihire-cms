import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import Consultations from './pages/admin/Consultations';
import SiteSettings from './pages/admin/SiteSettings';
import UserManagement from './pages/admin/UserManagement';
import PagesManager from './pages/admin/PagesManager';
import ServicesManager from './pages/admin/ServicesManager';
import InsightsManager from './pages/admin/InsightsManager';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
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
    <BrowserRouter basename="/immihire-cms/immi-admin">
      <Routes>
        <Route path="/login" element={<MinimalAuthLayout><Login /></MinimalAuthLayout>} />
        <Route path="/forgot-password" element={<MinimalAuthLayout><ForgotPassword /></MinimalAuthLayout>} />
        <Route path="/reset-password" element={<MinimalAuthLayout><ResetPassword /></MinimalAuthLayout>} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Consultations />} />
          <Route path="pages" element={<PagesManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="insights" element={<InsightsManager />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
