// folioxe/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation(); // To get the current location for redirection after login

  if (authLoading) {
    // Show a loading state while Firebase is determining the auth status.
    // This prevents a flash of the login page or protected content.
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> {/* Adjust min-h based on your layout */}
        <p className="text-xl text-gray-700 dark:text-gray-300">Verifying authentication...</p>
        {/* You could replace this with a more sophisticated spinner component */}
      </div>
    );
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect them to the /login page.
    // We pass the current location in the `state` object. This allows us to redirect
    // the user back to the page they were originally trying to access after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child components (the protected page).
  // The `children` prop will be the component we want to protect, like <UserProfilePage />.
  return children;
};

export default ProtectedRoute;