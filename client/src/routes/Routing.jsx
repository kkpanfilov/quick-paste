import { Routes, Route } from "react-router";

import { routes } from "./routes.data.js";

import NotFound from "@/components/screens/not-found/NotFound.jsx";

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
