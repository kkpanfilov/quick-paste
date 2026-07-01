import { Routing } from "@/routes/Routing.jsx";

import { Header } from "./header/Header.tsx";

export const Layout = () => {
  return (
    <div>
      <Header />
      <Routing></Routing>
    </div>
  );
};
