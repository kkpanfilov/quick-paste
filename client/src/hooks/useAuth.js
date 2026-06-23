import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { login, logout } from "@/store/auth/authSlice.js";

export function useAuth() {
  const dispatch = useDispatch();

  return {
    ...useSelector(
      (state) => ({
        isAuth: state.auth.isAuth,
        userId: state.auth.userId,
      }),
      shallowEqual,
    ),
    login: ({ userId }) => dispatch(login({ userId })),
    logout: () => dispatch(logout()),
  };
}
