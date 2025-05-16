import { useState } from 'react';
import { Tag, Zap } from 'lucide-react';
import { useReadContract } from 'wagmi';

import MiniAppListHeader from '../components/layout/MiniAppListHeader';
import AppCard from '../components/AppCard';
// import FeaturedAppCard from '../components/FeaturedAppCard';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

const categories = ["Social", "Finance", "NFTs", "Games", "Developer Tools", 
  "Communication", "Entertainment", "News", "Governance", "Shopping"];

function MiniAppList() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: miniappids = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAllApps'
  }) as { data: bigint[] | undefined };

  const { data: filterminiappids = [] } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppsByCategory',
    args: [selectedCategory]
  }) as { data: bigint[] | undefined };

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
        {selectedCategory === 'All' && (
          <section className="mb-10">
            <div className="flex items-center mb-4">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Apps</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              
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
          
          {selectedCategory === "All" && miniappids.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {miniappids.map(id => (
                <AppCard key={id} id={id} />
              ))}
            </div>
          ) : filterminiappids.length > 0 ? (
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
