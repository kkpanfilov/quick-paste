import { createSlice, nanoid } from "@reduxjs/toolkit";

const DEFAULT_TIMEOUT = 4000;

const initialState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // TODO: rewrite to prepare and reducer
      if (!action.payload?.message) return;

      state.items.push({
        id: nanoid(),
        type: action.payload.type || "info",
        title: action.payload.title,
        message: action.payload.message,
        timeout: action.payload.timeout
          ? action.payload.timeout
          : DEFAULT_TIMEOUT,
      });
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
