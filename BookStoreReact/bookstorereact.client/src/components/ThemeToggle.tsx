import { TablerMoon, TablerSun } from "../icons";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <TablerSun className="w-5 h-5" />
            ) : (
                <TablerMoon className="w-5 h-5" />
            )}
        </button>
    );
}
