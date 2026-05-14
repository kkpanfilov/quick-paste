import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useDeletePaste() {
  return useMutation({
    mutationFn: (id) => apiClient("DELETE", `pastes/${id}`),
  });
}
