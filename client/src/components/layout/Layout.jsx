import { Routing } from "@/routes/Routing.jsx";

import { Header } from "./header/Header.jsx";

export const Layout = () => {
  return (
    <div>
      <Header />
      <Routing></Routing>
    </div>
  );
};
