import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useLogin() {
  return useMutation({
    mutationFn: (body) => apiClient("POST", "auth/login", body),
  });
}