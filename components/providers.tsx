"use client";

import "process/browser";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { baseSepolia } from "viem/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";

import { ThemeProvider } from "./theme-provider";
import { ChainGuard } from "./chain-guard";

import { config } from "@/lib/wagmi";

export const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute="class"
      defaultTheme="dark"
    >
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ChainGuard />
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </OnchainKitProvider>
    </ThemeProvider>
  );
}
