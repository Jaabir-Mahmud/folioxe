// folioxe/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ProductListingPage from './pages/ProductListingPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import SubmitProductPage from './pages/SubmitProductPage.jsx';
import SellerDashboardPage from './pages/SellerDashboardPage.jsx';
import CartPage from './pages/CartPage.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import DownloadSuccessPage from './pages/DownloadSuccessPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx';
import ReviewSection from './pages/ReviewSection.jsx';

// Context Providers
import { AuthProvider } from './contexts/AuthContext.jsx';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BalanceProvider } from './contexts/BalanceContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <UserRoleProvider>
            <NotificationProvider>
              <BalanceProvider>
                <CartProvider>
                  <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductListingPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/download" element={<DownloadPage />} />
                        <Route path="/download-success" element={<DownloadSuccessPage />} />
                        <Route path="/reviews" element={<ReviewSection />} />

                        {/* Protected Routes */}
                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <UserProfilePage />
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
                        <Route
                          path="/seller-dashboard"
                          element={
                            <ProtectedRoute>
                              <SellerDashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/admin-dashboard"
                          element={
                            <ProtectedRoute>
                              <AdminDashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/super-admin"
                          element={
                            <ProtectedRoute>
                              <SuperAdminDashboard />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </CartProvider>
              </BalanceProvider>
            </NotificationProvider>
          </UserRoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;