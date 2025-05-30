// folioxe/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation(); // To get the current location for redirection after login

  if (authLoading) {
    // Show a loading state while Firebase is determining the auth status
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> {/* Adjust min-h as needed */}
        <p className="text-xl text-gray-700 dark:text-gray-300">Checking authentication...</p>
        {/* You could put a spinner component here */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect them to the /login page
    // We pass the current location in the state so we can redirect them back
    // to the page they were trying to access after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child components (the protected page)
  return children;
};

export default ProtectedRoute;