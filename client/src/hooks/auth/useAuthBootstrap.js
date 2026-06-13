import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import { refreshAccessToken } from "@/api/auth/refreshAccessToken.js";
import { clearAccessToken, setAccessToken } from "@/shared/authStore.js";
import { login, logout } from "@/store/auth/authSlice.js";

import { useAuth } from "../useAuth.js";

export function useAuthBootstrap() {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        if (isAuth) {
          setIsAuthChecked(true);
          return;
        }

        const result = await refreshAccessToken();

        setAccessToken(result.accessToken);
        dispatch(login({ userId: result.id }));
      } catch {
        clearAccessToken();
        dispatch(logout());
      } finally {
        setIsAuthChecked(true);
      }
    }

    bootstrapAuth();
  }, [isAuth, dispatch]);

  return { isAuthChecked };
}
