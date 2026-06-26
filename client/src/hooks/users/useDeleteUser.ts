import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { Message } from "@/types/common.types.ts";

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string): Promise<Message> =>
      apiClient<Message>("DELETE", `users/${id}`),
  });
}
