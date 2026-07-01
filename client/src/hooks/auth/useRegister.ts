import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.ts";
import type { RegisterDto, RegisterResponse } from "@/types/auth.types.ts";

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterDto): Promise<RegisterResponse> =>
      apiClient<RegisterResponse, RegisterDto>("POST", "auth/register", body),
  });
}
