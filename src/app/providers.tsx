"use client";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { config } from "@/wagmi-config/config";
import { ReactNode } from "react";

export const Providers = (props: { children: ReactNode }) => {
  // defining query client
  const queryClient = new QueryClient();

  // getting enviroment id from .env file
  const ENV_ID = process.env.NEXT_APP_DYNAMIC_ENV_ID;



  return (
    <DynamicContextProvider
      settings={{
        environmentId: "da965b15-5fe4-42a9-a3e0-d48a31b25235",
        walletConnectors: [EthereumWalletConnectors, ZeroDevSmartWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{props.children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
