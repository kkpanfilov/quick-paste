import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useUpdatePaste() {
  return useMutation({
    mutationFn: ({ id, body }) => apiClient("PATCH", `pastes/${id}`, body),
  });
}
