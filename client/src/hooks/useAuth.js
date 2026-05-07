import { useSelector } from "react-redux";

export function useAuth() {
  const { isAuth, userId } = useSelector((state) => {
    return {
      isAuth: state.auth.isAuth,
      userId: state.auth.userId,
    };
  });

  return {
    isAuth,
    userId,
  };
}
