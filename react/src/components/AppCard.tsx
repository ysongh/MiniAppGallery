import { Link } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { useReadContract } from 'wagmi';

import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

function AppCard({ id }: { id: Number }) {
  const { data: miniapp } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppDetails',
    args: [id]
  });

  console.log(miniapp);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      {/* App Icon */}
      <div className="flex justify-center p-6 bg-gray-50">
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
          {miniapp?.name?.charAt(0)}
        </div>
      </div>
      
      {/* App Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{miniapp?.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{miniapp?.developerAddress}</p>
        <div className="flex items-center mt-2">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(miniapp?.ratingCount?.toString())
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">{miniapp?.ratingCount?.toString()}</span>
        </div>
        <p className="text-gray-600 text-sm mt-3 line-clamp-2 h-10">
          {miniapp?.description}
        </p>
        <div className="mt-4">
          <a
            href={miniapp?.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open App
          </a>
        </div>
        <div className="mt-4">
          <Link
            to={`/app/${id}`}
            className="flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
