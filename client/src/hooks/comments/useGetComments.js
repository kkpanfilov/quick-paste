import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetComments(id) {
  return useQuery({
    queryKey: ["paste_comments", id],
    queryFn: () => apiClient("GET", `comments/${id}`),
  });
}
