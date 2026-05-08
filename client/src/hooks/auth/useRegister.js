import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useRegister() {
  return useMutation({
    mutationFn: (body) => apiClient("POST", "auth/register", body),
  });
}
