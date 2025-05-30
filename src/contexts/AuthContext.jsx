// folioxe/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('folioxeUser');
      const storedToken = localStorage.getItem('folioxeToken');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        // Additionally check if this user is in our "registered" list for more robustness in mock
        if (localStorage.getItem(`folioxeRegisteredUser-${parsedUser.email}`)) {
            setUser(parsedUser);
            setIsAuthenticated(true);
        } else {
            // If user was in session storage but not "registered", clear session
            logout(); // Call logout to clear inconsistent state
        }
      }
    } catch (error) {
      console.error("Error reading auth state from localStorage", error);
      logout(); // Clear potentially corrupted storage by logging out
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('Attempting login with (AuthContext):', email, password);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const registeredUserData = localStorage.getItem(`folioxeRegisteredUser-${email}`);
        if (registeredUserData && password) { // Check if email is "registered" and password is provided
          const mockUser = JSON.parse(registeredUserData); // Use details from "registration"
          const mockToken = 'fake-jwt-token-login';

          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('folioxeUser', JSON.stringify(mockUser)); // Current logged-in user
          localStorage.setItem('folioxeToken', mockToken);
          console.log('Login successful (AuthContext)', mockUser);
          resolve(mockUser);
        } else {
          console.error('Login failed (AuthContext): Email not registered or password missing.');
          reject(new Error('Invalid email or password. (Or email not registered)'));
        }
      }, 1000);
    });
  };

  const signup = async (name, email, password) => {
    console.log('Attempting signup with (AuthContext):', name, email, password);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already "registered" in our mock localStorage database
        if (localStorage.getItem(`folioxeRegisteredUser-${email}`)) {
          console.error('Signup failed (AuthContext): Email already exists.');
          reject(new Error('Email already exists. Please try logging in.'));
          return;
        }

        const mockUser = { id: Date.now().toString(), name, email, role: 'user' };
        // "Register" the user in localStorage
        localStorage.setItem(`folioxeRegisteredUser-${email}`, JSON.stringify(mockUser));
        
        // Also log them in immediately after signup
        const mockToken = 'fake-jwt-token-signup';
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('folioxeUser', JSON.stringify(mockUser)); // Current logged-in user
        localStorage.setItem('folioxeToken', mockToken);
        console.log('Signup successful & logged in (AuthContext)', mockUser);
        resolve(mockUser);
      }, 1000);
    });
  };

  const logout = () => {
    console.log('Logging out (AuthContext)');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('folioxeUser');
    localStorage.removeItem('folioxeToken');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};