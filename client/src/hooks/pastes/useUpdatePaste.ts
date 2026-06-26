import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { Paste, UpdatePasteDto } from "@/types/paste.types.ts";

type UpdatePasteOptions = {
  id: string;
  body: UpdatePasteDto;
};

export function useUpdatePaste() {
  return useMutation({
    mutationFn: ({ id, body }: UpdatePasteOptions): Promise<Paste> =>
      apiClient<Paste>("PATCH", `pastes/${id}`, body),
  });
}
