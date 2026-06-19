import { Link } from "react-router";

import styles from "./Logo.module.scss";

export const Logo = ({ onClick }) => {
  return (
    <Link
      className={styles.brand}
      to="/"
      onClick={onClick}
      aria-label="Quick Paste home"
    >
      <span className={styles.brandMark}>QP</span>
      <span className={styles.brandText}>Quick Paste</span>
    </Link>
  );
};
