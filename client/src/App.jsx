import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "@/components/layout/Layout.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";

import { useAuthBootstrap } from "./hooks/auth/useAuthBootstrap.js";

const queryClient = new QueryClient();

export function App() {
  const { isAuthChecked } = useAuthBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <Loader isVisible={!isAuthChecked} label="Checking session..." />
      <Layout></Layout>
    </QueryClientProvider>
  );
}
