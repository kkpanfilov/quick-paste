import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, body }) => apiClient("PATCH", `users/${id}`, body),
  });
}
