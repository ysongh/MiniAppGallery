import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Calendar, 
  BarChart, 
  Download, 
  Share2, 
  Flag, 
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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
  downloads?: number;
  releaseDate?: string;
  version?: string;
  screenshots?: string[];
  longDescription?: string;
  privacyPolicy?: string;
  supportUrl?: string;
}

// Import the mockApps from your application context or API
// For this example, we'll assume a function that returns app by ID
const getAppById = (id: string): MiniApp | undefined => {
  // This would be a call to your API or app context in a real application
  // Placeholder function that returns mock app data
  const mockApp: MiniApp = {
    id: '1',
    name: 'Frames.js',
    description: 'Build interactive, onchain applications on Farcaster with the Frames protocol',
    developer: 'Farcaster Team',
    icon: 'https://example.com/frames.png',
    url: 'https://warpcast.com/~/launch/frames',
    category: 'Developer Tools',
    featured: true,
    rating: 4.8,
    downloads: 125000,
    releaseDate: '2024-03-15',
    version: '2.1.3',
    screenshots: [
      'https://example.com/frames-screenshot1.png',
      'https://example.com/frames-screenshot2.png',
      'https://example.com/frames-screenshot3.png'
    ],
    longDescription: 'Frames.js is a powerful framework for building interactive, onchain applications on Farcaster. With the Frames protocol, developers can create engaging experiences that blend social media with web3 functionality.\n\nThe library provides a comprehensive set of tools and components to streamline development and ensure compatibility across the Farcaster ecosystem. Whether you\'re building simple interactive posts or complex dApps, Frames.js offers the flexibility and performance you need.\n\nKey features include:\n- Easy integration with existing Farcaster apps\n- Robust authentication and authorization flows\n- Optimized performance for chain interactions\n- Comprehensive documentation and examples\n- Active developer community and support',
    privacyPolicy: 'https://frames.js.org/privacy',
    supportUrl: 'https://frames.js.org/support'
  };

  // Return the mock app if the ID matches
  return mockApp.id === id ? mockApp : undefined;
};

function AppDetail() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<MiniApp | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch the app details from an API
      const appData = getAppById(id);
      if (appData) {
        setApp(appData);
      }
      setLoading(false);
    }
  }, [id]);

  const nextScreenshot = () => {
    if (app?.screenshots) {
      setCurrentScreenshotIndex((prevIndex) => 
        prevIndex === app.screenshots!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevScreenshot = () => {
    if (app?.screenshots) {
      setCurrentScreenshotIndex((prevIndex) => 
        prevIndex === 0 ? app.screenshots!.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!app) {
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
                {app.name.charAt(0)}
              </div>
            </div>

            {/* App Info */}
            <div className="md:ml-6 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{app.name}</h1>
                  <p className="text-lg text-indigo-600 mt-1">{app.developer}</p>
                  <div className="flex items-center mt-2">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {app.category}
                    </span>
                    <span className="text-sm text-gray-500 ml-3">Version {app.version}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Get App
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
                          i < Math.floor(app.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{app.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center mr-6">
                  <Download className="w-4 h-4 mr-1 text-gray-500" />
                  <span>{app.downloads?.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                  <span>Released {new Date(app.releaseDate || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        {app.screenshots && app.screenshots.length > 0 && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Screenshots</h2>
            <div className="relative">
              <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden h-64 md:h-96">
                {/* Placeholder for screenshots - in a real app we'd use actual images */}
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-100 m-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-500">Screenshot {currentScreenshotIndex + 1}</div>
                      <div className="text-gray-500 mt-2">{app.name} - {app.screenshots[currentScreenshotIndex].split('/').pop()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation arrows */}
              {app.screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevScreenshot}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextScreenshot}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail indicators */}
            {app.screenshots.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {app.screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreenshotIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentScreenshotIndex ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Description */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About this app</h2>
          <div className="prose max-w-none text-gray-700">
            {app.longDescription?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Developer</h3>
                <p className="text-gray-700">{app.developer}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-gray-700">{app.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Version</h3>
                <p className="text-gray-700">{app.version}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Released</h3>
                <p className="text-gray-700">{new Date(app.releaseDate || '').toLocaleDateString()}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
                <p className="text-gray-700">{app.downloads?.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Links</h3>
                <div className="flex flex-col space-y-2 mt-1">
                  <a
                    href={app.privacyPolicy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    <span>Privacy Policy</span>
                  </a>
                  <a
                    href={app.supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    <span>Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            <Download className="w-5 h-5 mr-2" />
            Get App
          </a>
        </div>
      </main>
    </div>
  );
}

export default AppDetail;