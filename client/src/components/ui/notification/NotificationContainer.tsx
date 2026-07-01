import { useAppSelector } from "@/store/hooks.ts";

import { Notification } from "./Notification.tsx";

import styles from "./Notification.module.scss";

export const NotificationContainer = () => {
  const notifications = useAppSelector((state) => state.notification.items);

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );
};
