import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { useWriteContract, useAccount, useSwitchChain } from "wagmi";
import { celo } from "wagmi/chains";
import { sdk } from '@farcaster/frame-sdk';

import FormHeader from '../components/layout/FormHeader';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { getContractAddress } from '../utils/contractAddress';
import { supportedNetworks } from '../utils/contractAddress';

const categories = [
  "Developer Tools",
  "Shopping",
  "Finance",
  "Social",
  "NFTs",
  "Games"
];

function SubmitApp() {
  const navigate = useNavigate();
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    customCategory: '',
    networkId: celo.id.toString()
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    writeContract,
    data: txHash,
    isPending,
    isSuccess
  } = useWriteContract();

  const selectedNetwork = supportedNetworks.find(network => network.id.toString() === formData.networkId);
  const isCorrectNetwork = chain?.id.toString() === formData.networkId;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, category: value }));
    
    // Clear error
    if (errors.category) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, networkId: value }));
    
    // Clear error
    if (errors.networkId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.networkId;
        return newErrors;
      });
    }
  };

  const handleSwitchNetwork = async () => {
    if (!selectedNetwork) return;
    
    try {
      //@ts-ignore
      switchChain({ chainId: selectedNetwork.id });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'App name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (formData.category === 'other' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Please specify the category';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'App URL is required';
    } else if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    if (!formData.networkId) {
      newErrors.networkId = 'Please select a network';
    }

    if (!isConnected) {
      newErrors.wallet = 'Please connect your wallet';
    } else if (!isCorrectNetwork) {
      newErrors.network = `Please switch to ${selectedNetwork?.name} network`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);

      const {name, description, category, url} = formData;

      writeContract({
        address: getContractAddress(chain?.id || 1),
        abi: MiniAppGallery.abi,
        functionName: "registerApp",
        args: [name, description, category, url],
      })
      
      setIsSubmitting(false);
      console.log('Form submitted:', formData);
    }
  };

  const handleComposeCast = async () => {
    try {
      const result = await sdk.actions.composeCast({
        text: 'I submitted my mini app! Check out the gallery! 🎉',
        embeds: ["https://miniappgallery.netlify.app/"],
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <FormHeader />
        
        <div className="container mx-auto px-4 py-10 flex-1 flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">App Submitted Successfully!</h2>
            <p className="text-gray-600 text-center mb-8">
              Thank you for submitting your app on {selectedNetwork?.name}.
            </p>
            {isPending && <div className="mt-4">Pending...</div>}
            {txHash && (
              <div className="mt-4">
                <a
                  href={selectedNetwork?.chain.blockExplorers?.default.url + "/tx/" + txHash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View Transaction on {selectedNetwork?.name}
                </a>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handleComposeCast}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Share on Farcaster 🚀
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Return to App Store
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FormHeader />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Network Selection */}
              <div>
                <label htmlFor="networkId" className="block text-gray-700 font-medium mb-2">
                  Network
                </label>
                <select
                  id="networkId"
                  name="networkId"
                  value={formData.networkId}
                  onChange={handleNetworkChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                    errors.networkId
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                >
                  {supportedNetworks.map(network => (
                    <option key={network.id} value={network.id.toString()}>
                      {network.name}
                    </option>
                  ))}
                </select>
                {errors.networkId && (
                  <p className="text-red-500 text-sm mt-1">{errors.networkId}</p>
                )}
                
                {/* Network Status */}
                {isConnected && selectedNetwork && (
                  <div className="mt-2">
                    {isCorrectNetwork ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <Check className="w-4 h-4 mr-1" />
                        Connected to {selectedNetwork.name}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Switch to {selectedNetwork.name}
                        </div>
                        <button
                          type="button"
                          onClick={handleSwitchNetwork}
                          disabled={isSwitching}
                          className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {isSwitching ? 'Switching...' : 'Switch Network'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {errors.network && (
                  <p className="text-red-500 text-sm mt-1">{errors.network}</p>
                )}
                {errors.wallet && (
                  <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>
                )}
              </div>

              {/* App Name */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  App Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                    errors.name
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Enter your app name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* App Description */}
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="Describe your app in 2-3 sentences"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                    errors.category
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">Other (specify)</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Custom Category */}
              {formData.category === 'other' && (
                <div>
                  <label htmlFor="customCategory" className="block text-gray-700 font-medium mb-2">
                    Specify Category
                  </label>
                  <input
                    type="text"
                    id="customCategory"
                    name="customCategory"
                    value={formData.customCategory}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                      errors.customCategory
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-indigo-200'
                    }`}
                    placeholder="Enter custom category"
                  />
                  {errors.customCategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.customCategory}</p>
                  )}
                </div>
              )}

              {/* App URL */}
              <div>
                <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
                  Mini-App URL
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black ${
                    errors.url
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-indigo-200'
                  }`}
                  placeholder="https://yourwebsite.xyz"
                />
                {errors.url && (
                  <p className="text-red-500 text-sm mt-1">{errors.url}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Enter your app's URL, including https://
                </p>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || !isConnected || !isCorrectNetwork}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    isSubmitting || !isConnected || !isCorrectNetwork 
                      ? 'opacity-75 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : !isConnected ? (
                    'Connect Wallet First'
                  ) : !isCorrectNetwork ? (
                    `Switch to ${selectedNetwork?.name}`
                  ) : (
                    'Submit App'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SubmitApp;
