import { useId } from "react";

import styles from "./ErrorBlock.module.scss";

export type ErrorBlockProps = {
  title: string;
  message: string;
};

export const ErrorBlock = ({ title, message }: ErrorBlockProps) => {
  const titleId = useId();
  const messageId = useId();

  return (
    <div className={styles.container}>
      <section
        className={styles.block}
        role="alert"
        aria-labelledby={titleId}
        aria-describedby={messageId}
      >
        <span className={styles.icon} aria-hidden="true">
          !
        </span>

        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <p id={messageId} className={styles.message}>
            {message}
          </p>
        </div>
      </section>
    </div>
  );
};
