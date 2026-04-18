import { Route, Routes } from "react-router";

import NotFound from "@/components/screens/not-found/NotFound.jsx";

import { routes } from "./routes.data.js";

const Routing = () => {
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

export default Routing;
