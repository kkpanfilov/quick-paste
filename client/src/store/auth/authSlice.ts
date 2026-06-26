import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type AuthState = {
  userId: string | null;
  isAuth: boolean;
};

const initialState: AuthState = {
  userId: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: string }>) => {
      state.userId = action.payload.userId;
      state.isAuth = true;
    },
    logout: (state) => {
      state.userId = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
