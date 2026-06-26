import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/api/apiClient.js";
import type { UpdateUserDto, UpdatedUser } from "@/types/user.types.ts";

type UpdateUserOptions = {
  id: string;
  body: UpdateUserDto;
};

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, body }: UpdateUserOptions): Promise<UpdatedUser> =>
      apiClient<UpdatedUser>("PATCH", `users/${id}`, body),
  });
}
