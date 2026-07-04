"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Starts null so we don't render a guess before we know the real
  // (already-applied, no-flash) theme from the DOM on mount.
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (isDark === null) {
    // Avoids a mismatched icon flashing before we know the real theme.
    return <div className="size-[26px]" />;
  }

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center justify-center size-[26px] rounded border border-customBorder text-mutedText hover:text-foreground hover:bg-surfaceMuted transition-colors shrink-0"
    >
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
    </button>
  );
}