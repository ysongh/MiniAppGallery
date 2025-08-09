import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
// import { PrivyProvider } from '@privy-io/react-auth';
// import { WagmiProvider } from '@privy-io/wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';

import App from "./App.tsx";
import { config } from "./wagmi.ts";
// import { privyConfig } from './privyConfig';

import "./index.css";
import { CDPHooksProvider } from "@coinbase/cdp-hooks";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CDPHooksProvider config={{projectId: import.meta.env.VITE_CDP_PROJECT_ID }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </CDPHooksProvider>
  </React.StrictMode>,
);
