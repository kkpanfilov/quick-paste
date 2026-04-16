import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <a className={styles.brand} href="/" aria-label="Quick Paste home">
      <span className={styles.brandMark}>QP</span>
      <span className={styles.brandText}>Quick Paste</span>
    </a>
  );
};

export default Logo;
