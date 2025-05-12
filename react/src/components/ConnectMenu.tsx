import {
  useAccount,
  useConnect,
  useChains,
  useChainId,
} from "wagmi";

import { formatAddress } from "../utils/format";

export function ConnectMenu() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const chains = useChains();
  const chainId = useChainId();

  const currentChain = chains.find(chain => chain.id === chainId);

  if (isConnected) {
    return (
      <>
        <p>Connected to: {currentChain ? currentChain.name : 'Not connected'}</p>
        <div>{formatAddress(address)}</div>
      </>
    );
  }

  return (
    <button className="bg-blue-400" type="button" onClick={() => connect({ connector: connectors[0] })}>
      Connect
    </button>
  );
}
