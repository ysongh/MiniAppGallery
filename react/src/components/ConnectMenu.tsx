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
      <div className="bg-indigo-600 text-white px-6 md:px-20 py-3 shadow flex justify-between items-center">
        <div className="text-sm sm:text-base font-medium">
          🔗 Connected to: <span className="font-semibold">{currentChain ? currentChain.name : 'Not connected'}</span>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full text-sm sm:text-base hover:bg-indigo-100 transition"
        >
          {formatAddress(address || "")}
        </button>
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
