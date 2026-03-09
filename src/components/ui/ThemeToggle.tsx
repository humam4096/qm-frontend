import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  // If theme is system, we can evaluate what to switch to, or simply toggle light/dark explicitly.
  const isDark = 
    theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
      title="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
