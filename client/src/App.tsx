import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "@/components/layout/Layout.tsx";
import { Loader } from "@/components/ui/loader/Loader.tsx";
import { NotificationContainer } from "@/components/ui/notification/NotificationContainer.tsx";
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap.ts";

const queryClient = new QueryClient();

// TODO: add all endpoints to insomnia
export function App() {
  const { isAuthChecked } = useAuthBootstrap();

  if (!isAuthChecked)
    return <Loader isVisible={!isAuthChecked} label="Checking session..." />;

  return (
    <QueryClientProvider client={queryClient}>
      <Layout></Layout>
      <NotificationContainer />
    </QueryClientProvider>
  );
}
