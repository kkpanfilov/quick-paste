import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient("POST", "auth/logout"),
  });
}
