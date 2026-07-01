import { useEffect } from "react";

import { useNotifications } from "@/hooks/useNotifications.ts";

import styles from "./Notification.module.scss";

type Props = {
  id: string;
  type?: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timeout?: number;
  className?: string;
};

export const Notification = ({
  id,
  type = "info",
  title,
  message,
  timeout = 4000,
  className = "",
}: Props) => {
  const { removeNotification } = useNotifications();

  const classes = [styles.notification, styles[type], className]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const timerId = setTimeout(() => {
      removeNotification(id);
    }, timeout);

    return () => clearTimeout(timerId);
  }, [removeNotification, id, timeout]);

  const onClose = () => {
    removeNotification(id);
  };

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>

      <button
        type="button"
        className={styles.close}
        aria-label="Close notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};
