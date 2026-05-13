import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { removeNotification } from "@/store/notification/notificationSlice.js";

import styles from "./Notification.module.scss";

export const Notification = ({
  id,
  type = "info",
  title,
  message,
  timeout = 4000,
  className = "",
}) => {
  const dispatch = useDispatch();

  const classes = [styles.notification, styles[type], className]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch(removeNotification(id));
    }, timeout);

    return () => clearTimeout(timerId);
  }, [dispatch, id, timeout]);

  const onClose = () => {
    dispatch(removeNotification(id));
  };

  return (
    <div className={classes} role="status" aria-live="polite">
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
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
