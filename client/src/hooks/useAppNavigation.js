import { useNavigate } from "react-router";

import { paths } from "@/routes/paths.config.js";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate(paths.home),
    goNew: () => navigate(paths.new),
    goPaste: (id) => navigate(paths.paste(id)),
    goUser: (id) => navigate(paths.user(id)),
    goSignIn: () => navigate(paths.signin),
    goRegister: () => navigate(paths.register),
    goBack: () => navigate(-1),
    reload: () => navigate(0),
  };
}
