import Link from "next/link";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <span className={styles.kicker}>{SITE_TAGLINE}</span>

          <Link href="/" className={styles.wordmark}>
            {SITE_NAME}
          </Link>

          <div className={styles.actions}>
            <DarkModeToggle />
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/" className={styles.navLink}>
            Journal
          </Link>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <Link href="/add-edit-blog" className={styles.navLink}>
            Write an entry
          </Link>
        </nav>
      </div>
    </header>
  );
}
