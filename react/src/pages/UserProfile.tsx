import { useState, useEffect } from 'react';
import { User, Settings, Heart, ChevronLeft } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import sdk from "@farcaster/frame-sdk";

import AppCardWithEdit from '../components/AppCardWithEdit';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

export default function UserProfile() {
  const { address } = useAccount();

  const [activeTab, setActiveTab] = useState<'favorites' | 'developed'>('developed');
  const [fid, setFid] = useState<number>(0);
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const loadSDK = async () => {
      const context = await sdk.context;
      // @ts-ignore
      const newfid = context?.user?.fid;
      setFid(newfid);
      setDisplayName(context?.user?.displayName || "farcaster_user");
      setUsername(context?.user?.username || "Farcaster Enthusiast");

      console.log(context);
      // @ts-ignore
      console.log(context?.user);
      console.log(newfid);
    }
    loadSDK();
  }, [])

  const { data: miniappids = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppsByDeveloper',
    args: [address]
  }) as { data: bigint[] | undefined };

  console.log(miniappids, fid);

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
              <div className="w-24 h-24 rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center text-3xl font-bold">
                  {displayName.charAt(0)}
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-indigo-200">{username}</p>
            </div>
            
            {/* Settings Button (Desktop) */}
            <div className="hidden md:block">
              <button className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
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
                activeTab === 'favorites'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </button>
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
            {activeTab === 'favorites' && 'Favorite Apps'}
            {activeTab === 'developed' && 'Developed Apps'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'favorites' && `You have ${miniappids.length} favorite apps`}
            {activeTab === 'developed' && `You have developed ${miniappids.length} apps`}
          </p>
        </div>
        
        {/* Apps Grid */}
        {miniappids.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {miniappids.map(id => (
              <AppCardWithEdit key={id} id={id} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
            <div className="flex justify-center mb-4">
              {activeTab === 'favorites' && <Heart className="w-12 h-12 text-gray-300" />}
              {activeTab === 'developed' && <User className="w-12 h-12 text-gray-300" />}
            </div>
            <h3 className="text-lg font-medium text-gray-800">No apps found</h3>
            <p className="text-gray-500 mt-2">
              {activeTab === 'favorites' && "You don't have any favorite apps yet"}
              {activeTab === 'developed' && "You haven't developed any apps yet"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}