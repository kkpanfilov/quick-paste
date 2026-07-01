import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/auth/authSlice.ts";
import notificationReducer from "@/store/notification/notificationSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
