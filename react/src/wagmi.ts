import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { base, baseSepolia, celoSepolia, hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [base, baseSepolia, celoSepolia, hardhat],
  connectors: [farcasterFrame()],
  // @ts-ignore
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [celoSepolia.id]: http(),
    // [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
