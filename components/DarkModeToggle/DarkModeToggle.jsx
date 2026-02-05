"use client";

import { useEffect, useState } from "react";
import styles from "./DarkModeToggle.module.css";

export default function DarkModeToggle() {
  // ✅ Read localStorage ONLY once (safe)
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ Apply class + persist
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className={styles.btn}
      onClick={() => setDark((prev) => !prev)}
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
