import { EXCEPTION_MAP } from "../pastes.service.js";

export type IsPasteAccessible = Promise<{
  isAccessible: boolean;
  error: keyof typeof EXCEPTION_MAP | null;
}>;
