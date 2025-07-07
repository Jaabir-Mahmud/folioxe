// folioxe/src/pages/UserProfilePage.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Link } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading user profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          User Profile
        </h1>
      </header>

      {user ? (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400">
                {/* Placeholder for Profile Picture: You can use user.photoURL from Firebase if available from Google Sign-In */}
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                )}
              </div>
              <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Change Picture (UI only)
              </button>
            </div>

            <div className="md:col-span-2">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.displayName || 'N/A'}</p> {/* Uses displayName */}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email || 'N/A'}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{user.uid || 'N/A'}</p> {/* Changed to uid for consistency with Firebase */}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Verified</label>
                <p className={`mt-1 text-sm font-semibold ${user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {user.emailVerified ? 'Yes' : 'No'}
                </p>
              </div>
              {/* Removed role as it's not directly on the Firebase user object by default */}
              <div className="mt-8">
                <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors">
                  Edit Profile (UI only)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600 dark:text-gray-400">Could not load user details.</p>
      )}
    </div>
  );
};

export default UserProfilePage;