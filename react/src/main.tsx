import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';

import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { themeOverrides } from "./theme.ts";
import { privyConfig } from './privyConfig';

import "./index.css";
import { CDPReactProvider } from "@coinbase/cdp-react";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrivyProvider appId={import.meta.env.VITE_PRIVY_APPID} config={privyConfig}>
      <CDPReactProvider config={{projectId: import.meta.env.VITE_CDP_PROJECT_ID,  }} theme={themeOverrides}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
          <App />
          </WagmiProvider>
        </QueryClientProvider>
      </CDPReactProvider>
    </PrivyProvider>
  </React.StrictMode>,
);
