import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "@/components/layout/Layout.jsx";
import { Loader } from "@/components/ui/loader/Loader.jsx";
import { NotificationContainer } from "@/components/ui/notification/NotificationContainer.jsx";
import { useAuthBootstrap } from "@/hooks/auth/useAuthBootstrap.js";

const queryClient = new QueryClient();

// TODO: migrate to typescript
// TODO: remove .js and .ts
// TODO: extract api functions in src/hooks into separate folder (like /src/api/pastes.api.js)
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
