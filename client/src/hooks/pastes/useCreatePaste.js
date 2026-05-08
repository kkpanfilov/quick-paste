import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useCreatePaste() {
  return useMutation({
    mutationFn: (body) => apiClient("POST", "pastes", body),
  });
}
