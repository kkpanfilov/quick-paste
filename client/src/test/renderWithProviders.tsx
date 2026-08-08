import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";

import { NotificationContainer } from "@/components/ui/notification/NotificationContainer.tsx";
import authReducer from "@/store/auth/authSlice.ts";
import notificationReducer from "@/store/notification/notificationSlice.ts";

export function renderWithProviders(component: React.ReactNode) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      notification: notificationReducer,
    },
  });

  const queryClient = new QueryClient();

  return render(
    <MemoryRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {component}
          <NotificationContainer />
        </QueryClientProvider>
      </Provider>
    </MemoryRouter>,
  );
}
