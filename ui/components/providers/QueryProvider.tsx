"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { client as apiClient } from "@/lib/api/generated/client.gen";

/** Inlined at build time; set before any TanStack query runs (avoid empty baseUrl → same-origin /auth/* 404). */
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CHAT_API_URL ??
  "";

const chatApiToken = process.env.NEXT_PUBLIC_CHAT_API_TOKEN;

apiClient.setConfig({
  baseUrl: apiBaseUrl,
  credentials: "include",
  headers: chatApiToken ? { Authorization: `Bearer ${chatApiToken}` } : undefined,
});

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
