import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useCreateReply() {
  return useMutation({
    mutationFn: ({ id, pasteId, data }) =>
      apiClient("POST", `comments/${id}/reply`, { ...data, pasteId }),
  });
}
