import { Link } from "react-router";

import styles from "./Logo.module.scss";

export type Props = {
  onClick: () => void;
};

export const Logo = ({ onClick }: Props) => {
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
