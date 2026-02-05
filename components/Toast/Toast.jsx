"use client";

import { useEffect, useState, useCallback, useRef, startTransition } from "react";
import styles from "./Toast.module.css";

export default function Toast({ message, onClose, duration = 4000 }) {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);
  const prevMessageRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (message) {
      // Only reset exiting state when message changes from empty to non-empty
      if (!prevMessageRef.current) {
        startTransition(() => {
          setIsExiting(false);
        });
      }
      prevMessageRef.current = message;
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      prevMessageRef.current = null;
    }
  }, [message, duration, handleClose]);

  if (!message) return null;

  return (
    <div
      className={`${styles.toast} ${isExiting ? styles.exiting : styles.entering}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        <svg
          className={styles.icon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className={styles.message}>{message}</span>
      </div>
      <button
        className={styles.closeBtn}
        onClick={handleClose}
        aria-label="Close notification"
      >
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
