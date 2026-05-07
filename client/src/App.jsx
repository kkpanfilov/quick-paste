import Layout from "@/components/layout/Layout.jsx";

import { useAuthBootstrap } from "./hooks/auth/useAuthBootstrap.js";

// TODO: implement loader
function App() {
  useAuthBootstrap();
  return <Layout></Layout>;
}

export default App;
