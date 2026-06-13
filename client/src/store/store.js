import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/auth/authSlice.js";
import notificationReducer from "@/store/notification/notificationSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});
