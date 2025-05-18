import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
          <div onClick={() => navigate("/profile")}>
            {formatAddress(address || "")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
    >
      Connect Wallet to View
    </button>
  );
}
