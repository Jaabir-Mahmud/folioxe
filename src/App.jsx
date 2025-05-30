// folioxe/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'; // 1. Import ProtectedRoute

import HomePage from './pages/HomePage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';


function App() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute> {/* 2. Wrap UserProfilePage with ProtectedRoute */}
                  <UserProfilePage />
                </ProtectedRoute>
              } 
            />
            {/* You can add more protected routes here later in the same way:
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/submit-product" 
              element={
                <ProtectedRoute>
                  <SubmitProductPage />
                </ProtectedRoute>
              } 
            />
            */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;