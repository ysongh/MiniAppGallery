import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import sdk from "@farcaster/frame-sdk";
import {
  useAccount,
  useChains,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { usePrivy } from '@privy-io/react-auth';

import { supportedNetworks } from '../utils/contractAddress';

export function ConnectMenu() {
  const { authenticated, login } = usePrivy();
  const { address } = useAccount();
  // const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
 
  const chains = useChains();
  const chainId = useChainId();

  const currentChain = chains.find(chain => chain.id === chainId);

  const [pfpUrl, setpfpUrl] = useState<string>("");
  const [isMiniApp, setIsMiniApp] = useState<Boolean>(false);

  useEffect(() => {
    const loadSDK = async () => {
      const context = await sdk.context;
      setpfpUrl(context?.user?.pfpUrl || "");

      const newIsMiniApp = await sdk.isInMiniApp();
      setIsMiniApp(newIsMiniApp);
    }
    loadSDK();
  }, [])

   const handleSwitchNetwork = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = supportedNetworks.find(network => network.id.toString() === e.target.value);
    
    if (!selectedNetwork) return;
    
    try {
      //@ts-ignore
      switchChain({ chainId: selectedNetwork.id });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (authenticated) {
    return (
      <div className="bg-indigo-600 text-white px-6 md:px-20 py-3 shadow flex justify-between items-center">
        <div className="text-sm sm:text-base font-medium flex items-center">
          <p className="font-semibold mr-2">🔗 Connected to: </p>
          <select
            id="networkId"
            name="networkId"
            value={currentChain ? currentChain.id : 1}
            onChange={handleSwitchNetwork}
            className="p-1 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-indigo-200 bg-white"
          >
            {supportedNetworks.map(network => (
              <option key={network.id} value={network.id.toString()}>
                {network.name}
              </option>
            ))}
          </select>
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

  console.log(isMiniApp)

  return (
    <div className="bg-blue-300">
      <div className="container mx-auto py-3">
        <div className="flex justify-between gap-4 ">
          {/* <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet Only
          </button> */}
          <h1 className="text-2xl font-bold">Mini App Gallery</h1>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={() => login()}
          >
            Login with Privy
          </button>
        </div>
      </div>
    </div>
  );
}
