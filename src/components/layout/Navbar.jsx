// folioxe/src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'; // 1. Import useRef
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation

// Icons (MoonIcon, SunIcon, MenuIcon, XIcon - assuming they are defined above as before or imported)
// For brevity, I'll assume they are defined. If not, please re-add their SVG definitions.
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg> );
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> );
const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> );


const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // For closing mobile menu on route change
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null); // Ref for the mobile menu itself
  const mobileMenuButtonRef = useRef(null); // Ref for the hamburger button

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  // Effect to handle Escape key press and outside click
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current &&
          !mobileMenuButtonRef.current.contains(event.target)
          ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    } else {
      document.body.style.overflow = 'unset'; // Restore body scroll
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset'; // Ensure scroll is restored on unmount
    };
  }, [isMobileMenuOpen]); // Re-run effect if isMobileMenuOpen changes


  // Effect to close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]); // Listen to changes in pathname


  if (typeof theme === 'undefined' || typeof toggleTheme !== 'function') {
    return <nav className="bg-red-300 h-16 flex items-center justify-center text-white">Error: Theme context failed to load.</nav>;
  }

  const NavLinksContent = ({ isMobile }) => ( // Renamed and added isMobile prop
    <>
      <Link
        to="/products"
        className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : 'inline-block'}`}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Products
      </Link>
      {/* Add other primary navigation links here later */}
    </>
  );

  const AuthLinksContent = ({ isMobile }) => ( // Renamed and added isMobile prop
    <>
      {isAuthenticated ? (
        <>
          <Link 
            to="/profile"
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : 'inline-block'}`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            Hi, {user?.displayName ? user.displayName.split(' ')[0] : (user?.email || 'Profile')}
          </Link>
          <button
            onClick={handleLogout} // handleLogout already closes the menu
            className={`w-full text-left md:w-auto bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : ''}`}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : 'inline-block'}`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm ${isMobile ? 'block text-center' : 'inline-block'}`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
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
              <NavLinksContent isMobile={false} />
            </div>
          </div>

          {/* Right side: Auth Links (Desktop) & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            {!authLoading && <AuthLinksContent isMobile={false} />}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
             <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              ref={mobileMenuButtonRef} // Assign ref to the button
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
        <div 
          ref={mobileMenuRef} // Assign ref to the menu
          className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-800 shadow-lg z-40 pb-3 animate-fadeInDown" 
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinksContent isMobile={true} />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            {!authLoading && <AuthLinksContent isMobile={true} />}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;