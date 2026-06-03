import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useUnlikePaste() {
  return useMutation({
    mutationFn: (id) => apiClient("POST", `pastes/${id}/unlike`),
  });
}
