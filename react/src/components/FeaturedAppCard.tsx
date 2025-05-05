import { Zap, Star, ExternalLink } from 'lucide-react';

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

function FeaturedAppCard({ app }: { app: MiniApp }) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
      {/* Featured Badge */}
      <div className="absolute top-3 right-3 bg-yellow-400 text-xs text-gray-800 font-medium px-2 py-1 rounded-full flex items-center">
        <Zap className="w-3 h-3 mr-1" />
        Featured
      </div>
      
      {/* App Icon */}
      <div className="flex justify-center p-6 bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
          {app.name.charAt(0)}
        </div>
      </div>
      
      {/* App Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{app.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{app.developer}</p>
        <div className="flex items-center mt-2">
          <div className="flex mr-2">
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
        <p className="text-gray-600 text-sm mt-3">
          {app.description}
        </p>
        <div className="mt-4 flex">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open App
          </a>
        </div>
      </div>
    </div>
  );
}

export default FeaturedAppCard;
