import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetOwnPaste(page = 1) {
  const url = `pastes/me?page=${page}`;

  return useQuery({
    queryKey: ["own_pastes", page],
    queryFn: () => apiClient("get", url),
  });
}
