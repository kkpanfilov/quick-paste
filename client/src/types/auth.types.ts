export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type LoginDto = {
  username: string;
  password: string;
};

export type RegisterResponse = {
  accessToken: string;
  id: string;
};

export type LoginResponse = {
  accessToken: string;
  id: string;
};

export type RefreshResponse = {
  accessToken: string;
  id: string;
};

export type LogoutResponse = {
  message: string;
  success: boolean;
  error?: string | undefined;
};
