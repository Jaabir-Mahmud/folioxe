// folioxe/src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'; // 1. Import useRef
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useCart } from '../../contexts/CartContext.jsx';

// Icons (MoonIcon, SunIcon, MenuIcon, XIcon - assuming they are defined above as before or imported)
// For brevity, I'll assume they are defined. If not, please re-add their SVG definitions.
const MoonIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg> );
const SunIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg> );
const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg> );


const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.272 1.016M7.5 14.25A3.75 3.75 0 0 0 11.25 18h1.5a3.75 3.75 0 0 0 3.75-3.75V6.75m-9 7.5V6.75m0 0L5.25 4.5m2.25 2.25h9.75m0 0l1.5 2.25m-1.5-2.25V18a3.75 3.75 0 0 1-3.75 3.75h-1.5A3.75 3.75 0 0 1 6.75 18V6.75z" />
  </svg>
);

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // For closing mobile menu on route change
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

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

  // Effect for scroll transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY < 40) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
        setShowNavbar(false); // scrolling down
      } else if (window.scrollY < lastScrollY.current) {
        setShowNavbar(true); // scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
            to="/submit-product"
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : 'inline-block'}`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            Submit Product
          </Link>
          <Link 
            to="/seller-dashboard"
            className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isMobile ? 'block' : 'inline-block'}`}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
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

  // Calculate opacity: 0.95 at top, 0.6 at 200px+, linear in between
  const minOpacity = 0.6;
  const maxOpacity = 0.95;
  const scrollMax = 200;
  const opacity = scrollY < 0 ? maxOpacity : scrollY > scrollMax ? minOpacity : maxOpacity - ((maxOpacity - minOpacity) * (scrollY / scrollMax));

  return (
    <nav
      className="shadow-md sticky top-0 z-50 transition-colors duration-500"
      style={{
        background: theme === 'dark'
          ? `rgba(31,41,55,${opacity})` // dark:bg-gray-800
          : `rgba(255,255,255,${opacity})`, // bg-white
        backdropFilter: 'saturate(180%) blur(12px)',
        WebkitBackdropFilter: 'saturate(180%) blur(12px)',
        transform: showNavbar ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 0.4s cubic-bezier(.4,0,.2,1), background 0.5s',
      }}
    >
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
            {/* Cart Icon (only if logged in) */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="View cart">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
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
            {/* Cart Icon (Mobile, only if logged in) */}
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2 mr-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="View cart">
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
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