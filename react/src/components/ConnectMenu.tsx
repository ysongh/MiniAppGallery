import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import {
  useAccount,
  useConnect,
  useChains,
  useChainId,
  useDisconnect,
} from "wagmi";
import { usePrivy } from '@privy-io/react-auth';

export function ConnectMenu() {
  const { login } = usePrivy();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
 
  const chains = useChains();
  const chainId = useChainId();

  const currentChain = chains.find(chain => chain.id === chainId);

  const [pfpUrl, setpfpUrl] = useState<string>("");

  useEffect(() => {
    const loadSDK = async () => {
      const context = await sdk.context;
      setpfpUrl(context?.user?.pfpUrl || "");
    }
    loadSDK();
  }, [])

  if (isConnected) {
    return (
      <div className="bg-indigo-600 text-white px-6 md:px-20 py-3 shadow flex justify-between items-center">
        <div className="text-sm sm:text-base font-medium">
          🔗 Connected to: <span className="font-semibold">{currentChain ? currentChain.name : 'Not connected'}</span>
        </div>
        <div className="flex">
          <Link
            to="/profile"
            className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-full text-sm sm:text-base hover:bg-indigo-100 transition"
          >
            <img
              src={pfpUrl ? pfpUrl : `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
              alt="wallet avatar"
              className="w-6 h-6 rounded-full"
            />
            Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        Connect Wallet
      </button>
      <button
        type="button"
        onClick={() => login()}
        className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded hover:bg-red-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        Login with Privy
      </button>
    </div>
    
  );
}
