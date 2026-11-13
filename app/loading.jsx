import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.text}>Loading</span>
      <span className={styles.rule} aria-hidden="true" />
    </div>
  );
}
