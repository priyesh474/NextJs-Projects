"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logoLink}>
          <h1 className={styles.logo}>Article Room</h1>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/add-edit-blog" className={styles.navLink}>
            Add Blog
          </Link>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
