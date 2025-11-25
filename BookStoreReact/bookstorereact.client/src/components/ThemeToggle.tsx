import { useState } from "react";
import { TablerMoon, TablerSun } from "../icons"; 

export default function ThemeToggle() {
    const [isDarkIcon, setIsDarkIcon] = useState(false);

    const handleClick = () => {
        setIsDarkIcon((prev) => !prev);
        //THIS is where the logic lives for when we swap light and dark mode
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="p-2 rounded hover:bg-slate-100"
            aria-label="Toggle theme"
        >
            {isDarkIcon ? (
                <TablerMoon className="w-5 h-5" />
            ) : (
                <TablerSun className="w-5 h-5" />
            )}
        </button>
    );
}
