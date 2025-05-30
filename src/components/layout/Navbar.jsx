// folioxe/src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

// Icon Components (as provided in your code)
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m8.66-12.34l-.71.71M4.05 19.95l-.71-.71M21 12h-1M4 12H3m16.95 7.95l-.71-.71M4.05 4.05l-.71.71M12 5a7 7 0 100 14 7 7 0 000-14z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> {/* Consistent strokeWidth */}
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> {/* Consistent strokeWidth */}
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate('/'); // Redirect to homepage after logout
  };
  
  // Fallback for theme context not loading
  if (typeof theme === 'undefined' || typeof toggleTheme !== 'function') {
    console.error("Theme context not available in Navbar.");
    return (
      <nav className="bg-red-300 dark:bg-red-700 h-16 flex items-center justify-center text-white dark:text-red-100 shadow-md sticky top-0 z-50">
        Error: Theme context failed.
      </nav>
    );
  }

  const AuthLinks = () => (
    <>
      {isAuthenticated ? (
        <>
          <Link 
            to="/profile"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors block md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Hi, {user?.displayName ? user.displayName.split(' ')[0] : (user?.email || 'Profile')}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left md:w-auto bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors block md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm block md:inline-block text-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav Links (Desktop) */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                FolioXe
              </Link>
            </div>
            <div className="hidden md:flex items-baseline space-x-1 ml-6">
              <Link
                to="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)} // Good practice to close mobile menu if ever visible here
              >
                Products
              </Link>
              {/* Add other main navigation links here */}
            </div>
          </div>

          {/* Right side: Auth Links (Desktop) & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {!authLoading && <AuthLinks />} {/* Show auth links when not loading auth state */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) & Mobile Theme Toggle */}
          <div className="md:hidden flex items-center">
             <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMobileMenuOpen && (
        // Note: For the animation 'animate-fadeInDown' to work, 
        // you need to define it in your tailwind.config.js theme.extend.keyframes and theme.extend.animation
        <div className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-800 shadow-lg z-40 pb-3 animate-fadeInDown" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            {/* Add other main navigation links here for mobile */}
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            {!authLoading && <AuthLinks />} {/* Auth links in mobile menu */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;