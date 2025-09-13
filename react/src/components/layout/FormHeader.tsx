import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { getBGColor } from '../../utils/getColors';

function FormHeader({ chainId }: { chainId: number }) {
  const navigate = useNavigate();

  console.log(chainId, "chainId")
  
  return (
    <header className={`${getBGColor(chainId)} text-white p-6`}>
      <div className="container mx-auto">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Submit Your Mini-App</h1>
            <p className="mt-1 text-purple-100">Add your app to the Mini App Gallery</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default FormHeader