import { useNavigate } from "react-router";

import { paths } from "@/routes/paths.config.ts";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate(paths.home),
    goNew: () => navigate(paths.new),
    goPaste: (id: string) => navigate(paths.paste(id)),
    goUser: (id: string) => navigate(paths.user(id)),
    goSearch: (query: string) => navigate(paths.search(query)),
    goSignIn: () => navigate(paths.signin),
    goRegister: () => navigate(paths.register),
    goBack: () => navigate(-1),
    reload: () => navigate(0),
  };
}
