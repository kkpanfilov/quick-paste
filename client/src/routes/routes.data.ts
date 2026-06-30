import type { JSX } from "react";

import { Home } from "@/components/screens/home/Home.jsx";
import { New } from "@/components/screens/new/New.jsx";
import { Paste } from "@/components/screens/paste/Paste.jsx";
import { Register } from "@/components/screens/register/Register.jsx";
import { SearchPage } from "@/components/screens/search/SearchPage.jsx";
import { Signin } from "@/components/screens/signin/Signin.jsx";
import { User } from "@/components/screens/user/User.jsx";

import { paths } from "./paths.config.js";

type RouteId = keyof typeof paths;

export type Route = {
  id: RouteId;
  path: string;
  title: string;
  component: () => JSX.Element;
};

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
    id: "paste",
    path: paths.paste(":id"),
    title: "Paste",
    component: Paste,
  },
  {
    id: "user",
    path: paths.user(":id"),
    title: "User",
    component: User,
  },
  {
    id: "search",
    path: paths.search(":query"),
    title: "search",
    component: SearchPage,
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
] as const satisfies readonly Route[];
