import { useDispatch } from "react-redux";

import {
  addNotification,
  removeNotification,
} from "@/store/notification/notificationSlice.js";

export function useNotifications() {
  const dispatch = useDispatch();

  return {
    notifySuccess: ({ title, message }) => {
      dispatch(
        addNotification({
          type: "success",
          title,
          message,
        }),
      );
    },
    notifyError: ({ title, message }) => {
      dispatch(
        addNotification({
          type: "error",
          title,
          message,
        }),
      );
    },
    notifyInfo: ({ title, message }) => {
      dispatch(
        addNotification({
          type: "info",
          title,
          message,
        }),
      );
    },
    notifyWarning: ({ title, message }) => {
      dispatch(
        addNotification({
          type: "warning",
          title,
          message,
        }),
      );
    },
    removeNotification: (id) => {
      dispatch(removeNotification(id));
    },
  };
}
