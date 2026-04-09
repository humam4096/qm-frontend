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
      className="flex items-center justify-center p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
      title="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
