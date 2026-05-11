import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetPaste(id) {
  return useQuery({
    queryKey: ["paste", id],
    queryFn: () => apiClient("get", `pastes/${id}`),
  });
}
