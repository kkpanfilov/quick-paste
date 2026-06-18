import { statisticsLabels } from "../../assets/statisticsLabels.js";

import styles from "./StatCard.module.scss";

export const StatCard = ({ label, value }) => {
  return (
    <article className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{statisticsLabels[label]}</span>
    </article>
  );
};
