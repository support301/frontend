"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  return (
  <button
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="group p-2 rounded-md bg-card text-foreground 
               transition-all duration-200 ease-out hover:scale-110 active:scale-100"
  >
    {theme === "dark" ? (
      <Sun className="h-5 w-5 text-yellow-500 transition-transform duration-300 
                      group-hover:rotate-100" />
    ) : (
      <Moon className="h-5 w-5 text-gray-800 transition-transform duration-300 
                       group-hover:rotate-100" />
    )}
  </button>
);
}
