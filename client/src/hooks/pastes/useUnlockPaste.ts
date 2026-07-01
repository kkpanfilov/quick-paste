import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { Paste } from "@/types/paste.types.ts";

type UnlockPasteDto = {
  id: string;
  password: string;
};

export function useUnlockPaste() {
  return useMutation({
    mutationFn: ({ id, password }: UnlockPasteDto): Promise<Paste> =>
      apiClient<Paste>("POST", `pastes/${id}/unlock`, { password }),
  });
}
