import styles from "./Loader.module.scss";

type Props = {
  isVisible?: boolean;
  label?: string;
};

export function Loader({ isVisible = true, label = "Loading..." }: Props) {
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
