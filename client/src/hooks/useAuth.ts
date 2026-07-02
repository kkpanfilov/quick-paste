import { shallowEqual } from "react-redux";

import { login, logout } from "@/store/auth/authSlice.ts";
import { useAppDispatch, useAppSelector } from "@/store/hooks.ts";

export function useAuth() {
  const dispatch = useAppDispatch();

  return {
    ...useAppSelector(
      (state) => ({
        isAuth: state.auth.isAuth,
        userId: state.auth.userId,
      }),
      shallowEqual,
    ),
    login: ({ userId }: { userId: string }) => dispatch(login({ userId })),
    logout: () => dispatch(logout()),
  };
}
