import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { Message } from "@/types/common.types.ts";

type DeletePasteResult = Message;

export function useDeletePaste() {
  return useMutation({
    mutationFn: (id: string): Promise<DeletePasteResult> =>
      apiClient<DeletePasteResult>("DELETE", `pastes/${id}`),
  });
}
