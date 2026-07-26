import styles from "./LoaderBlock.module.scss";

export type LoaderBlockProps = {
  isVisible?: boolean;
  label?: string;
};

export const LoaderBlock = ({
  isVisible = true,
  label = "Loading...",
}: LoaderBlockProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.block} role="status" aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  );
};
