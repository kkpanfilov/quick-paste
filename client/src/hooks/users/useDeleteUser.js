import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id) => apiClient("DELETE", `users/${id}`),
  });
}
