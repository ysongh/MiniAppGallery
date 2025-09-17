import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { arbitrum, base, celo } from "wagmi/chains";

export const config = createConfig({
  chains: [arbitrum, base, celo],
  connectors: [farcasterFrame()],
  // @ts-ignore
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
    [celo.id]: http(),
    // [hardhat.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
