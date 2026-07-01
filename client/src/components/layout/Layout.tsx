import { Routing } from "@/routes/Routing.tsx";

import { Header } from "./header/Header.tsx";

export const Layout = () => {
  return (
    <div>
      <Header />
      <Routing></Routing>
    </div>
  );
};
