import { useEffect, useState } from "react";

import { refreshAccessToken } from "@/api/auth/refreshAccessToken.ts";
import { clearAccessToken, setAccessToken } from "@/shared/authStore.ts";

import { useAuth } from "../useAuth.ts";

type UseAuthBootstrapResult = {
  isAuthChecked: boolean;
};

export function useAuthBootstrap(): UseAuthBootstrapResult {
  const { isAuth, login, logout } = useAuth();

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        if (isAuth) {
          setIsAuthChecked(true);
          return;
        }

        const result = await refreshAccessToken();

        if (result?.accessToken) {
          setAccessToken(result.accessToken);
          login({ userId: result.id });
        }
      } catch {
        clearAccessToken();
        logout();
      } finally {
        setIsAuthChecked(true);
      }
    }

    bootstrapAuth();
  }, [isAuth, login, logout]);

  return { isAuthChecked };
}
