import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { http } from "wagmi";
import { createConfig } from '@privy-io/wagmi';
import { base, baseSepolia, celoAlfajores, hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [base, baseSepolia, celoAlfajores, hardhat],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [celoAlfajores.id]: http(),
    [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
