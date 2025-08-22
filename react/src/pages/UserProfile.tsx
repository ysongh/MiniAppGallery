import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronLeft } from 'lucide-react';
import { useAccount, useBalance, useDisconnect, useReadContract } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import sdk from "@farcaster/frame-sdk";

import AppCardWithEdit from '../components/AppCardWithEdit';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { formatAddress } from '../utils/format';
import { getContractAddress } from '../utils/contractAddress';

export default function UserProfile() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { ready, authenticated } = usePrivy();

  const [activeTab, setActiveTab] = useState<'favorites' | 'developed'>('developed');
  const [fid, setFid] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [pfpUrl, setpfpUrl] = useState<string>("");
  const [isMiniApp, setIsMiniApp] = useState<Boolean>(false);

  if (ready && !authenticated) {
    navigate("/");
  }

  const result = useBalance({
    address,
    unit: 'ether', 
  })

  useEffect(() => {
    const loadSDK = async () => {
      const context = await sdk.context;
      // @ts-ignore
      const newfid = context?.user?.fid;
      setFid(newfid);
      setDisplayName(context?.user?.displayName || "farcaster_user");
      setUsername(context?.user?.username || "Farcaster Enthusiast");
      setpfpUrl(context?.user?.pfpUrl || "");

      // @ts-ignore
      const newIsMiniApp = await sdk.isInMiniApp();
      setIsMiniApp(newIsMiniApp);

      console.log(context);
      // @ts-ignore
      console.log(context?.user);
      console.log(newfid);
    }
    loadSDK();
  }, [])

  const { data: baseSepoliaMiniappids = [] } = useReadContract({
    address: getContractAddress(84532),
    abi: MiniAppGallery.abi,
    functionName: 'getAppsByDeveloper',
    args: [address],
    chainId: 84532,
  }) as { data: bigint[] | undefined };

   const { data: totalDonationsSent = 0 } = useReadContract({
    address: getContractAddress(84532),
    abi: MiniAppGallery.abi,
    functionName: 'totalDonationsSent',
    args: [address],
    chainId: 84532,
  }) as { data: bigint | undefined };

  console.log(baseSepoliaMiniappids, fid, result);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>Back to App Store</span>
            </a>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={pfpUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`}
                alt="wallet avatar"
                className="w-24 h-24 rounded-full"
              />
            </div>
            
            {/* Profile Info */}
            {isMiniApp ? (
              <div className="flex-grow">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <p className="text-indigo-200">@{username}</p>
                <p>{Number(totalDonationsSent)} ETH Donated</p>
                <p>{result?.data?.value?.toString()} ETH</p>
              </div>
            ) : (
              <div className="flex-grow">
                <div className="flex items-end">
                  <h1 className="text-2xl font-bold mr-2">
                    {formatAddress(address || "")}
                  </h1>
                </div>
                <p>{Number(totalDonationsSent)} ETH Donated</p>
                <p>{result?.data?.value?.toString()} ETH</p>
              </div>
            )}
                        
            {/* Settings Button (Desktop) */}
            <div className="hidden md:block">
              <button
                onClick={() => disconnect()}
                className="ml-2 py-2 px-4 bg-red-600 text-white font-medium rounded hover:bg-red-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                Disconnect
              </button>
            </div>

            {/* Settings Button (Mobile) */}
            <div className="mt-4 md:hidden">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg w-full justify-center" onClick={() => disconnect()}>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex">
            <button
              className={`px-4 py-4 text-sm font-medium flex items-center ${
                activeTab === 'developed'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              onClick={() => setActiveTab('developed')}
            >
              <User className="w-4 h-4 mr-2" />
              Developed
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === 'developed' && 'Developed Apps'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'developed' && `You have developed ${baseSepoliaMiniappids.length} apps`}
          </p>
        </div>
        
        {/* Apps Grid */}
        {baseSepoliaMiniappids.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {baseSepoliaMiniappids.map(id => (
              <AppCardWithEdit key={id + "1"} id={id} chainId={84532} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="flex justify-center mb-4">
              {activeTab === 'developed' && <User className="w-12 h-12 text-gray-300" />}
            </div>
            <h3 className="text-lg font-medium text-gray-800">No apps found</h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'developed' && "You haven't developed any apps yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}