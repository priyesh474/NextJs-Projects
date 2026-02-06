"use client";

import { useEffect, useState } from "react";
import styles from "./DarkModeToggle.module.css";

export default function DarkModeToggle() {
  // ✅ State derived during render (React-approved)
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ Effects ONLY sync external systems
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className={styles.btn}
      onClick={() => setDark(prev => !prev)}
      aria-label="Toggle dark mode"
      suppressHydrationWarning
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
