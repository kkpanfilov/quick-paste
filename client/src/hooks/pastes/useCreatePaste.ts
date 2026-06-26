import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { CreatePasteDto } from "@/types/paste.types.ts";

type CreatePasteResult = {
  id: string;
};

export function useCreatePaste() {
  return useMutation({
    mutationFn: (body: CreatePasteDto): Promise<CreatePasteResult> =>
      apiClient<CreatePasteResult, CreatePasteDto>("POST", "pastes", body),
  });
}
