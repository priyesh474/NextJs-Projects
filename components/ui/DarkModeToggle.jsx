"use client";

import { useSyncExternalStore } from "react";
import styles from "./DarkModeToggle.module.css";

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("theme") === "dark";
}

function getServerSnapshot() {
  return false;
}

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);

  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {
    // Storage can be unavailable (private mode); the theme still applies.
  }

  listeners.forEach((listener) => listener());
}

export default function DarkModeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => setTheme(!dark)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
    >
      {dark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.2" strokeLinecap="round" />
          <path strokeLinecap="round" d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.4 8.4 0 1 0 20 14.4Z"
          />
        </svg>
      )}
    </button>
  );
}
