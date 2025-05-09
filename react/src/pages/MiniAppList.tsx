import { useState, useEffect } from 'react';
import { Tag, Zap } from 'lucide-react';
import { useReadContract } from 'wagmi';

import MiniAppListHeader from '../components/layout/MiniAppListHeader';
import AppCard from '../components/AppCard';
import FeaturedAppCard from '../components/FeaturedAppCard';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

// Define TypeScript interfaces
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
}

// Mock data representing Farcaster mini-apps
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
    rating: 4.8
  },
  {
    id: '2',
    name: 'Farcaster Market',
    description: 'Buy and sell on the decentralized marketplace built for the Farcaster community',
    developer: 'Market Labs',
    icon: 'https://example.com/market.png',
    url: 'https://warpcast.com/~/launch/market',
    category: 'Shopping',
    featured: true,
    rating: 4.5
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
    rating: 4.2
  },
  {
    id: '4',
    name: 'CastChat',
    description: 'Direct messaging for Farcaster users with end-to-end encryption',
    developer: 'Chat Labs',
    icon: 'https://example.com/castchat.png',
    url: 'https://warpcast.com/~/launch/castchat',
    category: 'Communication',
    featured: true,
    rating: 4.7
  },
  {
    id: '5',
    name: 'CastPoll',
    description: 'Create and participate in polls within the Farcaster ecosystem',
    developer: 'Poll Systems',
    icon: 'https://example.com/castpoll.png',
    url: 'https://warpcast.com/~/launch/castpoll',
    category: 'Social',
    featured: false,
    rating: 4.0
  },
  {
    id: '6',
    name: 'CastNFT',
    description: 'Mint and trade NFTs directly from your Farcaster account',
    developer: 'NFT Collective',
    icon: 'https://example.com/castnft.png',
    url: 'https://warpcast.com/~/launch/castnft',
    category: 'NFTs',
    featured: false,
    rating: 4.3
  },
  {
    id: '7',
    name: 'FarEvents',
    description: 'Discover and attend events for the Farcaster community',
    developer: 'Event Horizon',
    icon: 'https://example.com/farevents.png',
    url: 'https://warpcast.com/~/launch/farevents',
    category: 'Social',
    featured: false,
    rating: 4.1
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
    rating: 4.6
  },
  {
    id: '9',
    name: 'FarNews',
    description: 'Curated news for the web3 ecosystem',
    developer: 'News Network',
    icon: 'https://example.com/farnews.png',
    url: 'https://warpcast.com/~/launch/farnews',
    category: 'News',
    featured: false,
    rating: 4.0
  },
  {
    id: '10',
    name: 'CastDAO',
    description: 'Create and manage DAOs within the Farcaster network',
    developer: 'DAO Builders',
    icon: 'https://example.com/castdao.png',
    url: 'https://warpcast.com/~/launch/castdao',
    category: 'Governance',
    featured: false,
    rating: 4.4
  },
  {
    id: '11',
    name: 'FarGames',
    description: 'Play games with your Farcaster friends',
    developer: 'Game Studios',
    icon: 'https://example.com/fargames.png',
    url: 'https://warpcast.com/~/launch/fargames',
    category: 'Games',
    featured: false,
    rating: 4.2
  },
  {
    id: '12',
    name: 'CastPay',
    description: 'Send and receive payments through Farcaster',
    developer: 'Pay Protocol',
    icon: 'https://example.com/castpay.png',
    url: 'https://warpcast.com/~/launch/castpay',
    category: 'Finance',
    featured: true,
    rating: 4.7
  }
];

// Get all unique categories from the apps
const categories = Array.from(new Set(mockApps.map(app => app.category)));

function MiniAppList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [apps, setApps] = useState<MiniApp[]>(mockApps);
  
  // Filter apps based on search term and selected category
  useEffect(() => {
    let filteredApps = mockApps;
    
    if (searchTerm) {
      filteredApps = filteredApps.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filteredApps = filteredApps.filter(app => 
        app.category === selectedCategory
      );
    }
    
    setApps(filteredApps);
  }, [searchTerm, selectedCategory]);

  const { data: miniappids = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAllApps'
  });

  // Get featured apps
  const featuredApps = mockApps.filter(app => app.featured);

  console.log(miniappids);

  return (
    <div className="min-h-screen bg-gray-50">
      <MiniAppListHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              onClick={() => setSelectedCategory('All')}
            >
              <Tag className="w-4 h-4 mr-2" />
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <Tag className="w-4 h-4 mr-2" />
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Apps Section */}
        {selectedCategory === 'All' && searchTerm === '' && (
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Apps</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredApps.map(app => (
                <FeaturedAppCard key={app.id} app={app} />
              ))}
            </div>
          </section>
        )}

        {/* All Apps */}
        <section>
          <div className="flex items-center mb-4">
            <Tag className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'All' ? 'All Apps' : selectedCategory}
            </h2>
          </div>
          
          {miniappids.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {miniappids.map(id => (
                <AppCard key={id} id={id} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">No apps found matching your search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MiniAppList;
