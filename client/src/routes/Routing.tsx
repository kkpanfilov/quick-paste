import { Route, Routes } from "react-router";

import { NotFound } from "@/components/screens/not-found/NotFound.tsx";

import { routes } from "./routes.data.ts";

export const Routing = () => {
  return (
    <Routes>
      {routes.map((route) => {
        const Screen = route.component;

        return <Route key={route.id} path={route.path} element={<Screen />} />;
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
