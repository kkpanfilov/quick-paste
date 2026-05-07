import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      // state.role = action.payload.role;
      state.isAuth = true;
    },
    logout: (state) => {
      state.userId = null;
      // state.role = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
