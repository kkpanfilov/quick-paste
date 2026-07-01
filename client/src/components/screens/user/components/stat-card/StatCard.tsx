import { statisticsLabels } from "../../assets/statisticsLabels.js";

import styles from "./StatCard.module.scss";

type Props = {
  label: keyof typeof statisticsLabels;
  value: number;
};

export const StatCard = ({ label, value }: Props) => {
  return (
    <article className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{statisticsLabels[label]}</span>
    </article>
  );
};
