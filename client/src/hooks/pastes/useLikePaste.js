import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useLikePaste() {
  return useMutation({
    mutationFn: (id) => apiClient("POST", `pastes/${id}/like`),
  });
}
