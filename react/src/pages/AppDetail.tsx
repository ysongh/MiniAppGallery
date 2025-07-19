import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Star,
  Calendar,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { sdk } from '@farcaster/frame-sdk';

import RatingSection from '../components/RatingSection';
import ReviewsList from '../components/ReviewsList';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { formatAddress, formatDate } from '../utils/format';

interface MiniApp {
  name: string;
  description: string;
  appUrl: string;
  developerAddress: string;
  totalRating: bigint;
  ratingCount: bigint;
  category: string;
  registrationDate: bigint;
}

type Review = {
  user: string;
  rating: number;
  comment: string;
  timestamp: number;
};

function AppDetail() {
  const { id } = useParams<{ id: string }>();

  const { address } = useAccount();

  const { data: miniapp } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppDetails',
    args: [id]
  }) as { data: MiniApp | undefined };

  const { data: appRatings = [] } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppRatings',
    args: [id]
  }) as { data: Review };

  console.log(appRatings);

  // Calculate rating safely
  const rating = miniapp && 'ratingCount' in miniapp && miniapp.ratingCount && miniapp.ratingCount > 0n
  ? Number(miniapp.totalRating) / Number(miniapp.ratingCount)
  : 0;
  
  const handleComposeCast = async () => {
    try {
      const result = await sdk.actions.composeCast({
        text: 'Check out my mini app🎉',
        embeds: ["https://miniappgallery.netlify.app/#/app/" + id],
        // Optional: parent cast reference
        // parent: { type: 'cast', hash: '0xabc123...' },
        // Optional: close the app after composing
        // close: true,
      });
  
      if (result) {
        console.log('Cast composed:', result.cast);
      } else {
        console.log('Cast composition was closed or canceled.');
      }
    } catch (error) {
      console.error('Error composing cast:', error);
    }
  };

  if (!miniapp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">App Not Found</h2>
        <p className="text-gray-600 mb-6">The app you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors">
          Return to App Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to App Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* App Overview */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row">
            {/* App Icon */}
            <div className="flex-shrink-0 flex items-start justify-center md:justify-start mb-6 md:mb-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {miniapp?.name?.charAt(0)}
              </div>
            </div>

            {/* App Info */}
            <div className="md:ml-6 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{miniapp?.name}</h1>
                  <p className="text-lg text-indigo-600 mt-1">{formatAddress(miniapp?.developerAddress)}</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {miniapp?.category}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleComposeCast}
                    className="py-2 px-4 my-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 w-full"
                  >
                    Share 
                  </button>
                  <a
                    href={miniapp?.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open App
                  </a>
                </div>
              </div>

              {/* Ratings and Downloads */}
              <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600">
                <div className="flex items-center mr-6">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating ? rating.toFixed(1) : '-'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  <span>Released {formatDate(miniapp?.registrationDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About this app</h2>
          <div className="prose max-w-none text-gray-700">
            {miniapp?.description}
          </div>
        </section>

        {/* @ts-ignore */}
        <ReviewsList reviews={appRatings} />

        {/* User Rating Section */}
        {address && address !== miniapp?.developerAddress && <RatingSection 
          appId={id} address={address}
        />}

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
          <a
            href={miniapp?.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Open App
          </a>
        </div>
      </main>
    </div>
  );
}

export default AppDetail;