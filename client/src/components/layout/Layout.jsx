import Routing from "@/routes/Routing.jsx";

import Header from "./header/Header.jsx";

const Layout = () => {
  return (
    <div>
      <Header />
      <Routing></Routing>
    </div>
  );
};

export default Layout;
