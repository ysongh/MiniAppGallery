import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { createConfig } from '@privy-io/wagmi';
import { createCDPEmbeddedWalletConnector } from '@coinbase/cdp-wagmi';
import { http } from 'wagmi';
import { base, baseSepolia, celoAlfajores, hardhat } from "wagmi/chains";
import { CDP_CONFIG } from "./config";

const connector = createCDPEmbeddedWalletConnector({
  cdpConfig: CDP_CONFIG,
  providerConfig: {
    chains: [base, baseSepolia],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http()
    }
  }
});

export const config = createConfig({
  chains: [base, baseSepolia, celoAlfajores, hardhat],
  connectors: [farcasterFrame(), connector],
  // @ts-ignore
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    // [celoAlfajores.id]: http(),
    // [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
