import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "@/components/layout/Layout.jsx";

import { useAuthBootstrap } from "./hooks/auth/useAuthBootstrap.js";

const queryClient = new QueryClient();

export function App() {
  useAuthBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <Layout></Layout>
    </QueryClientProvider>
  );
}
