import Home from "@/components/screens/home/Home.jsx";
import New from "@/components/screens/new/New.jsx";
import Register from "@/components/screens/register/Register.jsx";
import Signin from "@/components/screens/signin/Signin.jsx";

import { paths } from "./paths.config.js";

export const routes = [
  {
    id: "home",
    path: paths.home,
    title: "Home",
    component: Home,
  },
  {
    id: "new",
    path: paths.new,
    title: "New",
    component: New,
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
