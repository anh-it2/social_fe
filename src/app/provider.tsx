"use client";

import { SocketProvider } from "@/socket/client/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

// Silence React 19's "script inside component" warning that next-themes
// triggers when it renders its FOUC-prevention <script>. The script still
// runs correctly during SSR — this warning is cosmetic and dev-only.
if (
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  !(window as unknown as { __nextThemesWarningPatched?: boolean })
    .__nextThemesWarningPatched
) {
  (
    window as unknown as { __nextThemesWarningPatched?: boolean }
  ).__nextThemesWarningPatched = true;
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      first.includes("Encountered a script tag while rendering")
    ) {
      return;
    }
    origError(...args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>{children}</SocketProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
