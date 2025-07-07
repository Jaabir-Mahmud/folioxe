import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ onMenuClick, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        {/* Left side - Menu button */}
        <button
          onClick={onMenuClick}
          className="menu-button"
        >
          <Menu className="menu-icon" />
        </button>

        {/* Center - Page title */}
        <div className="page-title">
          <h1 className="title-text">
            FolioXe Admin Dashboard
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className="header-actions">
          {/* Notifications */}
          <button className="action-button">
            <Bell className="action-icon" />
            <span className="notification-badge"></span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="action-button theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="action-icon" />
            ) : (
              <Sun className="action-icon" />
            )}
          </button>

          {/* User menu */}
          <div className="user-menu-container">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="user-button"
            >
              <div className="user-avatar">
                <User className="user-icon" />
              </div>
              <div className="user-info">
                <p className="user-name">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="user-role">Administrator</p>
              </div>
              <ChevronDown className="chevron-icon" />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-email">
                    {user?.email}
                  </p>
                  <p className="dropdown-role">
                    Super Administrator
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="dropdown-item"
                >
                  <LogOut className="dropdown-icon" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="dropdown-overlay"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header; 