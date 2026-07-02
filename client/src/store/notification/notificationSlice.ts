import { type PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";

const DEFAULT_TIMEOUT = 4000;

type NotificationType = "info" | "success" | "warning" | "error";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timeout: number;
};

type NotificationOptions = {
  type?: NotificationType;
  title: string;
  message: string;
  timeout?: number;
};

type NotificationState = {
  items: NotificationItem[];
};

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: {
      prepare: ({
        type = "info",
        title,
        message,
        timeout = DEFAULT_TIMEOUT,
      }: NotificationOptions) => {
        if (!message) {
          throw new Error("Notification message is required");
        }

        return {
          payload: {
            id: nanoid(),
            type,
            title,
            message,
            timeout,
          },
        };
      },
      reducer: (state, action: PayloadAction<NotificationItem>) => {
        state.items.push(action.payload);
      },
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
