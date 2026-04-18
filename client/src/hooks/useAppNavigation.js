import { useNavigate } from "react-router";

import { paths } from "@/routes/paths.config.js";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate(paths.home),
    goSignIn: () => navigate(paths.signin),
    goRegister: () => navigate(paths.register),
    goNew: () => navigate(paths.new),
    goPaste: (id) => navigate(paths.paste(id)),
    goBack: () => navigate(-1),
  };
}
