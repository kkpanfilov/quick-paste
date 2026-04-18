import { paths } from "./paths.config.js";

import Home from "@/components/screens/home/Home.jsx";
import Signin from "@/components/screens/signin/Signin.jsx";
import Register from "@/components/screens/register/Register.jsx";

export const routes = [
  {
    id: "home",
    path: paths.home,
    title: "Home",
    component: Home,
  },
  {
    id: "signin",
    path: paths.signin,
    title: "Signin",
    component: Signin,
  },
  {
    id: "register",
    path: paths.register,
    title: "Register",
    component: Register,
  },
];
