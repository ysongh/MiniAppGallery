import { useState } from 'react';
import { Tag } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { base } from "wagmi/chains";

import MiniAppListHeader from '../components/layout/MiniAppListHeader';
import AppCard from '../components/AppCard';
// import FeaturedAppCard from '../components/FeaturedAppCard';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';

const categories = ["Social", "Finance", "NFTs", "Games", "Developer Tools", 
  "Communication", "Entertainment", "News", "Governance", "Shopping"];

function MiniAppList() {
  const { chain } = useAccount();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: miniappids = [] } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAllApps',
    chainId: chain?.id || base.id,
  }) as { data: bigint[] | undefined };

  const { data: filterminiappids = [] } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppsByCategory',
    args: [selectedCategory],
    chainId: chain?.id || base.id,
  }) as { data: bigint[] | undefined };

  console.log(miniappids);

  const sortIds = miniappids.slice().reverse();

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

        {/* All Apps */}
        <section>
          <div className="flex items-center mb-4">
            <Tag className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory === 'All' ? 'All Apps' : selectedCategory}
            </h2>
          </div>
          
          {selectedCategory === "All" && sortIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {sortIds.map(id => (
                <AppCard key={id} id={id} />
              ))}
            </div>
          ) : filterminiappids.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filterminiappids.map(id => (
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
