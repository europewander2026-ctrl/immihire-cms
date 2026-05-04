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
import Profile from './pages/admin/Profile';
import Login from './pages/admin/Login';
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

// --- Basic Token Gate (For Serverless Admin API) ---
const AdminTokenGate = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [inputValue, setInputValue] = useState('');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin API Access</h2>
          <p className="text-sm text-gray-500 mb-6">Enter the serverless admin secret to continue.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim()) {
              localStorage.setItem('admin_token', inputValue.trim());
              setToken(inputValue.trim());
              window.location.reload();
            }
          }}>
            <input 
              type="password" 
              placeholder="Admin Secret" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
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
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminTokenGate>
      <AdminApp />
    </AdminTokenGate>
  </React.StrictMode>
);
