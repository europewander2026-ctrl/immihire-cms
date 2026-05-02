import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingWidget from '../public/FloatingWidget';

const Layout = ({ logoUrl }) => {
  return (
    <>
      <Header logoUrl={logoUrl} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <FloatingWidget />
    </>
  );
};

export default Layout;
