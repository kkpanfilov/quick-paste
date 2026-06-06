import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useCreateComment() {
  return useMutation({
    mutationFn: ({ id, body }) => apiClient("POST", `comments/${id}`, body),
  });
}
