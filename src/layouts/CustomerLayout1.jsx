// src/layouts/CustomerLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';

export default function CustomerLayout({
  isSidebarOpen,
  toggleSidebar,
  isCartOpen,
  toggleCart,
}) {
  return (
    <>
      {/* Main site header */}
      <header>
        <Navbar toggleSidebar={toggleSidebar} toggleCart={toggleCart} />
        <div className="customer-login-links">
          <Link to="/login">Login</Link>         
        </div>
        <div className="customer-auth-links">
+          <Link to="/login" className="auth-link">Sign In</Link>
+          <span className="auth-separator">|</span>
+          <Link to="/register" className="auth-link">Register</Link>
+        </div>
      </header>
      

      {/* Sidebar & Cart */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isCartOpen && (<CartDrawer isCartOpen={isCartOpen} toggleCart={toggleCart} />)}
      

      {/* Page content */}
      <main className="content">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
