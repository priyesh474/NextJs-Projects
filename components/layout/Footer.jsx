import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.wordmark}>{SITE_NAME}</p>
        <p className={styles.note}>{SITE_TAGLINE}</p>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
