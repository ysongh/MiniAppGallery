import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { http, createConfig } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [base, baseSepolia, hardhat],
  connectors: [farcasterFrame()],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
