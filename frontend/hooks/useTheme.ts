'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize theme from DOM or localStorage on mount
  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const saved = localStorage.getItem('tb-theme');

      if (saved === 'light') {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      } else {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}

    // Listen for theme changes across windows/components
    const handleThemeChange = () => {
      try {
        const saved = localStorage.getItem('tb-theme');
        if (saved === 'light') {
          setTheme('light');
          document.documentElement.classList.remove('dark');
        } else {
          setTheme('dark');
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    };

    window.addEventListener('tb-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      window.removeEventListener('tb-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('tb-theme', next);
      } catch (e) {}

      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Dispatch event to notify other mounted components/pages
      window.dispatchEvent(new Event('tb-theme-change'));
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
