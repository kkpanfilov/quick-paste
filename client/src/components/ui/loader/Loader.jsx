import styles from "./Loader.module.scss";

export function Loader({ isVisible = true, label = "Loading..." }) {
  const classes = [
    styles.overlay,
    isVisible ? styles.visible : styles.hidden,
  ].join(" ");

  return (
    <div
      className={classes}
      role="status"
      aria-hidden={!isVisible}
      aria-live="polite"
    >
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
