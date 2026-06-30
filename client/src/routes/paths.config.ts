type DynamicPath = (param: string) => string;

type PathValue = string | DynamicPath;

export const paths = {
  home: "/",
  new: "/new",
  paste: (id: string) => `/paste/${id}`,
  user: (id: string) => `/user/${id}`,
  search: (query: string) => `/search/${query}`,
  signin: "/signin",
  register: "/register",
} as const satisfies Record<string, PathValue>;
