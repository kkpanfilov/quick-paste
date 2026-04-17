import { useNavigate } from "react-router";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate("/"),
    goSignIn: () => navigate("/signin"),
    goRegister: () => navigate("/register"),
    goNew: () => navigate("/new"),
    goPaste: (id) => navigate(`/paste/${id}`),
    goBack: () => navigate(-1),
  };
}

