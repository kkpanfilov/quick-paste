import { shallowEqual, useSelector } from "react-redux";

export function useAuth() {
  return useSelector(
    (state) => ({
      isAuth: state.auth.isAuth,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );
}
