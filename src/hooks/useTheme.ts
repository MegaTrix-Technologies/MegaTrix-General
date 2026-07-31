import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  // 1. Check saved preference
  const saved = localStorage.getItem("mt_theme") as Theme | null;
  if (saved === "dark" || saved === "light") return saved;
  // 2. Fall back to OS preference
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    // Ensure DOM attribute is synced
    const current = getInitialTheme();
    if (current !== theme) {
      setTheme(current);
    }
    applyTheme(current);

    // Listen for OS theme preference changes when user has no explicit preference saved
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("mt_theme");
      if (!saved) {
        const nextTheme: Theme = e.matches ? "light" : "dark";
        setTheme(nextTheme);
        applyTheme(nextTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("mt_theme", next);
      return next;
    });
  };

  return { theme, toggleTheme };
}
