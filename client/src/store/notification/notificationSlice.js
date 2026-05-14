import { createSlice, nanoid } from "@reduxjs/toolkit";

const DEFAULT_TIMEOUT = 4000;

const initialState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: {
      prepare: ({ type, title, message, timeout }) => {
        if (!message) {
          throw new Error("Notification message is required");
        }

        return {
          payload: {
            id: nanoid(),
            type: type || "info",
            title: title,
            message: message,
            timeout: timeout ? timeout : DEFAULT_TIMEOUT,
          },
        };
      },
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
    },

    removeNotification: (state, action) => {
      state.items = state.items.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
