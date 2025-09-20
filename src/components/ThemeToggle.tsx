import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--category-stroke)] hover:bg-[var(--bg-search-bar)] transition-colors"
      style={{ boxShadow: 'var(--shadow)' }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-[var(--text-primary)]" />
      ) : (
        <Sun className="w-5 h-5 text-[var(--bg-main)]" />
      )}
    </button>
  );
}

export default ThemeToggle; 