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
      <div className="bg-indigo-600 text-white flex justify-between py-2 px-6 md:px-20">
        <div>
          <p>Connected to: {currentChain ? currentChain.name : 'Not connected'}</p>
        </div>
        <div>
          <div>{formatAddress(address || "")}</div>
        </div>
      </div>
    );
  }

  return (
    <button className="bg-blue-400" type="button" onClick={() => connect({ connector: connectors[0] })}>
      Connect
    </button>
  );
}
