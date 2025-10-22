import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if there's a saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Default to dark mode if no preference is saved
    return true;
  });

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Update CSS custom properties for theme
    if (isDarkMode) {
      root.style.setProperty('--primary-bg', '#09090B');
      root.style.setProperty('--secondary-bg', '#141319');
      root.style.setProperty('--tertiary-bg', '#17171C');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--text-secondary', '#9ca3af');
      root.style.setProperty('--border-color', '#374151');
      root.style.setProperty('--hover-bg', '#1f2937');
      root.style.setProperty('--input-bg', '#09090B');
    } else {
      root.style.setProperty('--primary-bg', '#ffffff');
      root.style.setProperty('--secondary-bg', '#f8fafc');
      root.style.setProperty('--tertiary-bg', '#f1f5f9');
      root.style.setProperty('--text-color', '#1a202c');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--border-color', '#d1d5db');
      root.style.setProperty('--hover-bg', '#e5e7eb');
      root.style.setProperty('--input-bg', '#ffffff');
    }
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};