import { useAppDispatch } from "@/store/hooks.ts";
import {
  addNotification,
  removeNotification,
} from "@/store/notification/notificationSlice.js";

type Notification = {
  title: string;
  message: string;
};

export function useNotifications() {
  const dispatch = useAppDispatch();

  return {
    notifySuccess: ({ title, message }: Notification) => {
      dispatch(
        addNotification({
          type: "success",
          title,
          message,
        }),
      );
    },
    notifyError: ({ title, message }: Notification) => {
      dispatch(
        addNotification({
          type: "error",
          title,
          message,
        }),
      );
    },
    notifyInfo: ({ title, message }: Notification) => {
      dispatch(
        addNotification({
          type: "info",
          title,
          message,
        }),
      );
    },
    notifyWarning: ({ title, message }: Notification) => {
      dispatch(
        addNotification({
          type: "warning",
          title,
          message,
        }),
      );
    },
    removeNotification: (id: string) => {
      dispatch(removeNotification(id));
    },
  };
}
