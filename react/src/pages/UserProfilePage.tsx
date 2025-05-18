import { useState } from 'react';
import { User, Settings, Star, Heart, ChevronLeft, ExternalLink } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';

import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

// TypeScript interfaces
interface MiniApp {
  id: string;
  name: string;
  description: string;
  developer: string;
  icon: string;
  url: string;
  category: string;
  featured: boolean;
  rating: number;
  installDate?: string; // For installed apps
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  installedApps: string[]; // IDs of installed apps
  favoriteApps: string[]; // IDs of favorite apps
  developerApps: string[]; // IDs of apps developed by user
}

// Sample mock data
const mockApps: MiniApp[] = [
  {
    id: '1',
    name: 'Frames.js',
    description: 'Build interactive, onchain applications on Farcaster with the Frames protocol',
    developer: 'Farcaster Team',
    icon: 'https://example.com/frames.png',
    url: 'https://warpcast.com/~/launch/frames',
    category: 'Developer Tools',
    featured: true,
    rating: 4.8,
    installDate: '2025-04-15'
  },
  {
    id: '3',
    name: 'CastFi',
    description: 'Decentralized finance tools for managing your crypto assets',
    developer: 'CastFi Team',
    icon: 'https://example.com/castfi.png',
    url: 'https://warpcast.com/~/launch/castfi',
    category: 'Finance',
    featured: false,
    rating: 4.2,
    installDate: '2025-05-01'
  },
  {
    id: '5',
    name: 'CastPoll',
    description: 'Create and participate in polls within the Farcaster ecosystem',
    developer: '@farcaster_user', // This matches our sample user
    icon: 'https://example.com/castpoll.png',
    url: 'https://warpcast.com/~/launch/castpoll',
    category: 'Social',
    featured: false,
    rating: 4.0
  },
  {
    id: '8',
    name: 'CastStream',
    description: 'Live streaming platform built on Farcaster',
    developer: 'Stream Team',
    icon: 'https://example.com/caststream.png',
    url: 'https://warpcast.com/~/launch/caststream',
    category: 'Entertainment',
    featured: true,
    rating: 4.6,
    installDate: '2025-03-22'
  },
  {
    id: '11',
    name: 'FarGames',
    description: 'Play games with your Farcaster friends',
    developer: '@farcaster_user', // This matches our sample user
    icon: 'https://example.com/fargames.png',
    url: 'https://warpcast.com/~/launch/fargames',
    category: 'Games',
    featured: false,
    rating: 4.2
  }
];

const mockUserProfile: UserProfile = {
  id: 'user123',
  username: '@farcaster_user',
  displayName: 'Farcaster Enthusiast',
  profilePicture: 'https://example.com/profile.jpg',
  bio: 'Building mini-apps for the Farcaster ecosystem. Web3 developer and crypto enthusiast.',
  followerCount: 1243,
  followingCount: 587,
  installedApps: ['1', '3', '8'],
  favoriteApps: ['1', '8'],
  developerApps: ['5', '11']
};

export default function UserProfilePage() {
  const { address } = useAccount();

  const [activeTab, setActiveTab] = useState<'favorites' | 'developed'>('developed');
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [apps, setApps] = useState<MiniApp[]>(mockApps);

  const { data: miniappids = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppsByDeveloper',
    args: [address]
  }) as { data: bigint[] | undefined };
  
  // Filter apps based on active tab
  const displayedApps = apps.filter(app => {
    if (activeTab === 'favorites') {
      return userProfile.favoriteApps.includes(app.id);
    } else if (activeTab === 'developed') {
      return userProfile.developerApps.includes(app.id);
    }
    return false;
  });

  console.log(miniappids);

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
                  {userProfile.displayName.charAt(0)}
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold">{userProfile.displayName}</h1>
              <p className="text-indigo-200">{userProfile.username}</p>
              <p className="mt-2 text-white">{userProfile.bio}</p>
              <div className="flex mt-3 space-x-4">
                <div>
                  <span className="font-bold">{userProfile.followerCount.toLocaleString()}</span>
                  <span className="ml-1 text-indigo-200">Followers</span>
                </div>
                <div>
                  <span className="font-bold">{userProfile.followingCount.toLocaleString()}</span>
                  <span className="ml-1 text-indigo-200">Following</span>
                </div>
              </div>
            </div>
            
            {/* Settings Button (Desktop) */}
            <div className="hidden md:block">
              <button className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </button>
            </div>
          </div>
          
          {/* Settings Button (Mobile) */}
          <div className="mt-4 md:hidden">
            <button className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors w-full justify-center">
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </button>
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
            {activeTab === 'favorites' && `You have ${displayedApps.length} favorite apps`}
            {activeTab === 'developed' && `You have developed ${displayedApps.length} apps`}
          </p>
        </div>
        
        {/* Apps Grid */}
        {displayedApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedApps.map(app => (
              <AppCard key={app.id} app={app} activeTab={activeTab} />
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

// App Card Component
function AppCard({ app, activeTab }: { app: MiniApp; activeTab: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md">
      <div className="flex p-4">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {app.name.charAt(0)}
          </div>
        </div>
        
        {/* App Info */}
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-gray-800">{app.name}</h3>
          <p className="text-gray-500 text-xs">{app.developer}</p>
          
          <div className="flex items-center mt-1">
            <div className="flex mr-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(app.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{app.rating.toFixed(1)}</span>
          </div>
          
          {activeTab === 'developed' && (
            <div className="mt-1">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Published
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-3">
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          {activeTab === 'installed' ? 'Open App' : 
           activeTab === 'developed' ? 'Edit App' : 'Open App'}
        </a>
      </div>
    </div>
  );
}