import { useState } from 'react';
import { Heart, X } from 'lucide-react';

function TipModal({ closeTipModal, handleDonateToReviewer, chainId } : { closeTipModal: any , handleDonateToReviewer: any, chainId: number}) {
  const [tipAmount, setTipAmount] = useState('');

  const handleTipSubmit = () => {
   handleDonateToReviewer(tipAmount);
  };

  const symbol = chainId === 11142220 || 42220 ? "CELO" : "ETH";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-purple-400 border-3 rounded-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">         
          <button
            onClick={closeTipModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ({symbol})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.001"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 font-medium">{symbol}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Show your appreciation for this review by sending a tip to the user
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={closeTipModal}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleTipSubmit}
              disabled={!tipAmount || parseFloat(tipAmount) <= 0}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              <Heart className="w-4 h-4 mr-2" />
              Send Tip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TipModal;