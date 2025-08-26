import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

function MiniAppListHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mini App Gallery</h1>
            <p className="mt-2 text-purple-100">Discover the best mini-apps in the Farcaster ecosystem</p>
          </div>
          <div className="flex flex-col md:flex-row mt-4 md:mt-0 gap-4">
            <button
              onClick={() => navigate("/submitapp")}
              className="bg-white text-indigo-700 hover:bg-indigo-50 py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              Submit Your App
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MiniAppListHeader;