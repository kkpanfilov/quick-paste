import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { Paste } from "@/types/paste.types.ts";

export function useGetPaste(id: string) {
  return useQuery({
    queryKey: ["paste", id],
    queryFn: (): Promise<Paste> => apiClient<Paste>("GET", `pastes/${id}`),
  });
}
