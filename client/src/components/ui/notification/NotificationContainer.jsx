import { useSelector } from "react-redux";

import { Notification } from "./Notification.jsx";

import styles from "./Notification.module.scss";

export const NotificationContainer = () => {
  const notifications = useSelector((state) => state.notification.items);

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );
};
