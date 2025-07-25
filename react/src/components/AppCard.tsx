import { useNavigate } from 'react-router-dom';
import { Star, Tag, ExternalLink } from 'lucide-react';
import { useReadContract } from 'wagmi';

import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { formatAddress } from '../utils/format';
import { getContractAddress } from '../utils/contractAddress';

// Define types for the contract response
interface MiniApp {
  name: string;
  category: string;
  description: string;
  appUrl: string;
  developerAddress: string;
  totalRating: bigint;
  ratingCount: bigint;
  isActive: boolean;
}

function AppCard({ id, chainId }: { id: bigint, chainId: number }) {
  const navigate = useNavigate();
  
  const { data: miniapp } = useReadContract({
    address: getContractAddress(chainId),
    abi: MiniAppGallery.abi,
    functionName: 'getAppDetails',
    args: [id]
  }) as { data: MiniApp | undefined };

  console.log(miniapp);

  // Calculate rating safely
  const rating = miniapp && 'ratingCount' in miniapp && miniapp.ratingCount && miniapp.ratingCount > 0n
    ? Number(miniapp.totalRating) / Number(miniapp.ratingCount)
    : 0;
  
  // Get first letter of name safely
  const firstLetter = miniapp && 'name' in miniapp ? miniapp.name.charAt(0) : '?';

  if (miniapp && !miniapp?.isActive) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      {/* Mobile landscape layout */}
      <div className="flex sm:block">
        {/* App Icon */}
        <div className="flex justify-center items-center p-4 sm:p-6 bg-gray-50 sm:bg-gray-50 flex-shrink-0">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold cursor-pointer"
            onClick={() => navigate(`/app/${id}/${chainId}`)}
          >
            {firstLetter}
          </div>
        </div>
        
        {/* App Info */}
        <div className="p-4 flex-1 flex flex-col justify-between sm:block">
          <div>
            <div className="flex justify-between items-start sm:flex-col sm:items-start">
              <h3 className="font-bold text-base sm:text-lg text-gray-800">
                {miniapp && 'name' in miniapp ? miniapp.name : 'Loading...'}
              </h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center ml-2 sm:ml-0 sm:mt-1 whitespace-nowrap">
                <Tag className="w-3 h-3 mr-1" />
                {miniapp?.category}
              </span>
            </div>
            <div className="flex justify-between flex-row-reverse sm:block">
              <p className="text-gray-500 text-sm mt-1">
                {miniapp && 'developerAddress' in miniapp ? formatAddress(miniapp.developerAddress) : '-'}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">{rating ? rating.toFixed(1) : '-'}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2 sm:mt-3 line-clamp-2 sm:h-10">
              {miniapp && 'description' in miniapp ? miniapp.description : 'No description available'}
            </p>
          </div>
          <div className="mt-3 sm:mt-4">
            <a
              href={miniapp && 'appUrl' in miniapp ? miniapp.appUrl : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
