"use client";

import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "@/store";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="min-h-screen flex items-center justify-center ">
            Loading...
          </div>
        }
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                description: "!text-black",
              },
            }}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
