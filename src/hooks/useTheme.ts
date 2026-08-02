import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

export function useTheme() {
  // Start as "dark" for SSR — the real value is corrected on first client paint below.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Read the ACTUAL data-theme already set by the inline anti-flicker script
    // in __root.tsx. This is the source of truth and prevents the toggle thumb
    // from being stuck in "dark" when the real saved/OS theme is "light".
    const liveTheme: Theme =
      document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    setTheme(liveTheme);

    // Keep in sync with OS preference changes only when no explicit preference is saved.
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
