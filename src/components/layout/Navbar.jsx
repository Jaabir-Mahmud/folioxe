import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useUserRole } from '../../contexts/UserRoleContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.jsx';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { useBalance } from '../../contexts/BalanceContext.jsx';

// Icons
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.272 1.016M7.5 14.25A3.75 3.75 0 0 0 11.25 18h1.5a3.75 3.75 0 0 0 3.75-3.75V6.75m-9 7.5V6.75m0 0L5.25 4.5m2.25 2.25h9.75m0 0l1.5 2.25m-1.5-2.25V18a3.75 3.75 0 0 1-3.75 3.75h-1.5A3.75 3.75 0 0 1 6.75 18V6.75z" />
  </svg>
);
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const { isBuyer, isSeller, isAdmin, loading: roleLoading } = useUserRole();
  const { totalItems } = useCart();
  const { unreadCount } = useNotifications();
  const { balance } = useBalance();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

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
      }      {isAuthenticated && (
        <Link to="/cart" className="relative p-2">
          <CartIcon />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </Link>
      )}
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY < 40) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
        setShowNavbar(false);
      } else if (window.scrollY < lastScrollY.current) {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (authLoading || roleLoading) {
    return (
      <nav className="h-16 flex items-center justify-center text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-900">
        Loading Navbar...
      </nav>
    );
  }

  const opacity = scrollY < 0 ? 0.95 : scrollY > 200 ? 0.6 : 0.95 - ((0.95 - 0.6) * (scrollY / 200));

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const NavLinks = ({ isMobile }) => (
    <>
      <Link to="/products" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
        Products
      </Link>
      {isSeller() && (
        <>
          <Link to="/seller-dashboard" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
            Dashboard
          </Link>
          <Link to="/submit-product" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
            Submit Product
          </Link>
        </>
      )}
    </>
  );

  const AuthLinks = ({ isMobile }) => (
    <>
      {isAuthenticated ? (
        <>
          {isAdmin() && (
            <>
              <Link to="/admin-dashboard" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
                Admin
              </Link>
              <Link to="/super-admin" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium bg-purple-600 text-white rounded`}>
                Super Admin
              </Link>
            </>
          )}
          {isSeller() && balance !== null && (
            <div className={`${isMobile ? 'block' : 'inline-flex'} items-center px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400`}>
              ${balance.toFixed(2)}
            </div>
          )}
          <Link to="/notifications" className={`${isMobile ? 'block' : 'inline-flex'} items-center px-3 py-2 relative`}>
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
            {user?.displayName?.split(' ')[0] || 'Profile'}
          </Link>
          <button onClick={handleLogout} className={`${isMobile ? 'block w-full text-left' : ''} bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium`}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className={`${isMobile ? 'block' : 'inline-block'} px-3 py-2 rounded-md text-sm font-medium`}>
            Login
          </Link>
          <Link to="/signup" className={`${isMobile ? 'block' : 'inline-block'} bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium`}>
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav
      className="shadow-md sticky top-0 z-50 transition-colors duration-500"
      style={{
        background: theme === 'dark' ? `rgba(31,41,55,${opacity})` : `rgba(255,255,255,${opacity})`,
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        transform: showNavbar ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.4s ease-in-out, background 0.5s',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">FolioXe</Link>
            <div className="hidden md:flex ml-6">
              <NavLinks isMobile={false} />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            )}
            <AuthLinks isMobile={false} />
            <button onClick={toggleTheme} className="p-2">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>
          </div>
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 mr-2">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            <button onClick={toggleTheme} className="p-2 mr-2">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>
            <button ref={mobileMenuButtonRef} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden absolute top-16 inset-x-0 bg-white dark:bg-gray-800 shadow-lg z-40 pb-3 animate-fadeInDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLinks isMobile={true} />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            <AuthLinks isMobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
