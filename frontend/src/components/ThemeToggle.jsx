import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', !isDark);
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    if (savedMode) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div
      className={`relative w-20 h-10 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-gray-200'
      }`}
      onClick={toggleTheme}
      style={{
        boxShadow: isDark
          ? 'inset 4px 4px 8px #1f2937, inset -4px -4px 8px #374151'
          : 'inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff',
      }}
    >
      <div
        className={`absolute w-8 h-8 bg-white dark:bg-gray-700 rounded-full transition-transform duration-300 transform flex items-center justify-center ${
          isDark ? 'translate-x-10' : 'translate-x-1'
        }`}
        style={{
          boxShadow: isDark
            ? '4px 4px 8px #1f2937, -4px -4px 8px #374151'
            : '4px 4px 8px #d1d5db, -4px -4px 8px #ffffff',
        }}
      >
        {isDark ? (
          <FiMoon className="text-gray-200" size={16} />
        ) : (
          <FiSun className="text-yellow-500" size={16} />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;