// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('folioxe-theme');
    return localTheme || 'light'; // Default to light
  });

  useEffect(() => {
    const root = window.document.documentElement; // Targeting the <html> element

    if (theme === 'dark') {
      root.classList.add('dark'); // Add the 'dark' class to <html>
    } else {
      root.classList.remove('dark'); // Remove the 'dark' class from <html>
    }

    localStorage.setItem('folioxe-theme', theme); // Store the theme in local storage
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light')); // Toggle between light and dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };
