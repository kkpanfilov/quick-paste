import { Link } from "react-router";

import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <Link className={styles.brand} to="/" aria-label="Quick Paste home">
      <span className={styles.brandMark}>QP</span>
      <span className={styles.brandText}>Quick Paste</span>
    </Link>
  );
};

export default Logo;
