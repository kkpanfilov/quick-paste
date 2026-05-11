import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";

export function useGetPublicPaste() {
  return useQuery({
    queryKey: ["public-pastes"],
    queryFn: () => apiClient("get", `pastes/public`),
  });
}
