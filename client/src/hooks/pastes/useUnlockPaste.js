import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useUnlockPaste() {
  return useMutation({
    mutationFn: ({ id, password }) =>
      apiClient("POST", `pastes/${id}/unlock`, { password }),
  });
}
