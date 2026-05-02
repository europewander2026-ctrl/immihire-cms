import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import api from './utils/api';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BlogList from './pages/BlogList';

import InsightDetail from './pages/public/InsightDetail';
import PillHeader from './components/PillHeader';
import Footer from './components/Footer';
import FloatingWidget from './components/public/FloatingWidget';



// --- Public Layout Wrapper ---
const PublicLayout = ({ logoUrl }) => {
  return (
    <>
      <PillHeader logoUrl={logoUrl} />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};



// --- App Component ---
function App() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings');
        if (res.data) {
          setSiteSettings(res.data);
          if (res.data.faviconUrl) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = res.data.faviconUrl;
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter basename="/immihire-cms">
        <FloatingWidget />
        <Routes>
          {/* Public Routes with Header & Footer */}
          <Route element={<PublicLayout logoUrl={siteSettings?.logoUrl} />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<BlogList />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<div className="p-10 text-center text-xl">404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;