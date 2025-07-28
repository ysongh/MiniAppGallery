import { Link, useNavigate } from 'react-router-dom';
import { Star, ExternalLink } from 'lucide-react';
import { useReadContract, useWriteContract } from 'wagmi';

import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { formatAddress } from '../utils/format';
import { getContractAddress } from '../utils/contractAddress';

// Define types for the contract response
interface MiniApp {
  name: string;
  description: string;
  appUrl: string;
  developerAddress: string;
  totalRating: bigint;
  ratingCount: bigint;
  isActive: boolean;
}

function AppCardWithEdit({ id, chainId }: { id: bigint, chainId: number }) {
  const navigate = useNavigate();

  const { data: miniapp } = useReadContract({
    address: getContractAddress(chainId),
    abi: MiniAppGallery.abi,
    functionName: 'getAppDetails',
    args: [id],
    chainId: chainId,
  }) as { data: MiniApp | undefined };

  console.log(miniapp);

  const {
    writeContract,
    //data: txHash,
    isPending,
    //isSuccess
  } = useWriteContract();

  const togglePublished = () => {
    writeContract({
      address: import.meta.env.VITE_CONTRACT_ADDRESS,
      abi: MiniAppGallery.abi,
      functionName: "setAppStatus",
      args: [id, !miniapp?.isActive],
    })
  };
  
  // Calculate rating safely
  const rating = miniapp && 'ratingCount' in miniapp && miniapp.ratingCount && miniapp.ratingCount > 0n
  ? Number(miniapp.totalRating) / Number(miniapp.ratingCount)
  : 0;
  
  // Get first letter of name safely
  const firstLetter = miniapp && 'name' in miniapp ? miniapp.name.charAt(0) : '?';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md">
      <div className="flex p-4">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
             onClick={() => navigate(`/app/${id}`)}
          >
            {firstLetter}
          </div>
        </div>
        
        {/* App Info */}
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-gray-800">
            {miniapp && 'name' in miniapp ? miniapp.name : 'Loading...'}
          </h3>
          <p className="text-gray-500 text-xs">
            {miniapp && 'developerAddress' in miniapp ? formatAddress(miniapp.developerAddress) : '-'}
          </p>
          
          <div className="flex items-center mt-1">
            <div className="flex mr-1">
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
            <span className="text-xs text-gray-500">
              {rating ? rating.toFixed(1) : '-'}
            </span>
          </div>
          
          <div className="mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${ miniapp?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} onClick={togglePublished}>
              {isPending ? "Updating..." : miniapp?.isActive ? "Published" : "Not Published"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 p-3">
        <Link
          to={`/editapp/${id}/${chainId}`}
          className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Edit App
        </Link>
      </div>
    </div>
  );
}

export default AppCardWithEdit;
