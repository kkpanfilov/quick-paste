export type ISODateString = string;

export type Message = {
  success: boolean;
  message: string;
  error?: string | undefined;
};
