import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { LogoutResponse } from "@/types/auth.types.ts";

export function useLogout() {
  return useMutation({
    mutationFn: (): Promise<LogoutResponse> =>
      apiClient<LogoutResponse>("POST", "auth/logout"),
  });
}
