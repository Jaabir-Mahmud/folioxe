import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Overview from './sections/Overview';
import Users from './sections/Users';
import Products from './sections/Products';
import Reviews from './sections/Reviews';
import Analytics from './sections/Analytics';
import Settings from './sections/Settings';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPath={location.pathname}
      />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={currentUser}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="dashboard-content">
          <div className="dashboard-content-inner">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 