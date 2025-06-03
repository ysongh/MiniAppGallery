import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useReadContract, useWriteContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";

import FormHeader from '../components/layout/FormHeader';
import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';

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

const categories = [
  "Developer Tools",
  "Shopping",
  "Finance",
  "Social",
  "NFTs",
  "Games"
]

function EditApp() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    url: '',
    customCategory: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: miniapp } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getAppDetails',
    args: [id]
  }) as { data: MiniApp | undefined };

  useEffect(() => {
    if (miniapp) {
      setFormData({
        name: miniapp?.name,
        description: miniapp.description,
        category: miniapp.category,
        url: miniapp.appUrl,
        customCategory: ''
      })
    }
  }, [miniapp]);

  const {
    writeContract,
    data: txHash,
    isPending,
    isSuccess
  } = useWriteContract();

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);

      const {name, description, category, url} = formData;

      writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: MiniAppGallery.abi,
        functionName: "updateApp",
        args: [id, name, description, category, url],
      })
      
      setIsSubmitting(false);
      console.log('Form submitted:', formData);
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">App Updated Successfully!</h2>
            {isPending && <div className="mt-4">Pending...</div>}
            {txHash && (
              <div className="mt-4">
                <a
                  href={baseSepolia.blockExplorers?.default + "/tx/" + txHash}
                >
                  View Transaction
                </a>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition-colors"
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
                  disabled={isSubmitting}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update App'
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

export default EditApp;