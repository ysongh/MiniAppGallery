import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
// import { PrivyProvider } from '@privy-io/react-auth';
// import { WagmiProvider } from '@privy-io/wagmi';
import { WagmiProvider, } from 'wagmi';

import App from "./App.tsx";
import { config } from "./wagmi.ts";
// import { theme } from "./theme.ts";
// import { privyConfig } from './privyConfig';

import "./index.css";
import { CDPReactProvider, type Theme } from "@coinbase/cdp-react";

const queryClient = new QueryClient();

const themeOverrides: Partial<Theme> = {
   //@ts-ignore
  "colors-background": "black",
  "colors-backgroundOverlay": "rgba(0,0,0,0.5)",
  "colors-text": "white",
  "colors-textSecondary": "#999999",
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CDPReactProvider config={{projectId: import.meta.env.VITE_CDP_PROJECT_ID,  }} theme={themeOverrides}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </CDPReactProvider>
  </React.StrictMode>,
);
