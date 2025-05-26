import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useReadContract, useWriteContract } from 'wagmi';

import MiniAppGallery from '../artifacts/contracts/MiniAppGallery.sol/MiniAppGallery.json';
import { CONTRACT_ADDRESS } from '../config';

interface UserRating {
  value: number;
  comment: string;
}

const RatingSection = ({ appId, address }: { appId: string | undefined, address: string | undefined}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: userRatingData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: MiniAppGallery.abi,
    functionName: 'getUserRating',
    args: [appId, address]
  }) as { data: UserRating | undefined };

  useEffect(() => {
    if (userRatingData) {
      setRating(userRatingData.value);
      setFeedback(userRatingData.comment);
    }
  }, [userRatingData]);

  const { writeContractAsync } = useWriteContract();

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      setErrorMessage('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Submit rating to blockchain
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: MiniAppGallery.abi,
        functionName: 'rateApp',
        args: [appId, rating, feedback],
      });
      
      // Update UI state
      setHasRated(true);
      
    } catch (error) {
      console.error('Error submitting rating:', error);
      setErrorMessage('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <h3 className="text-lg font-medium text-green-800">Thank you for your feedback!</h3>
        <p className="text-green-700 mt-1">Your rating has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-14">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Rate this App</h2>
      
      <div className="flex flex-col items-center md:items-start">
        {/* Star Rating */}
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  (hoveredRating || rating) >= star
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        
        {/* Rating Description */}
        <p className="text-gray-600 mb-4 h-6">
          {rating === 1 && "Poor - Needs significant improvement"}
          {rating === 2 && "Fair - Has some issues to address"}
          {rating === 3 && "Good - Meets basic expectations"}
          {rating === 4 && "Very Good - Exceeds expectations"}
          {rating === 5 && "Excellent - Outstanding experience"}
        </p>
        
        {/* Feedback Textarea */}
        <div className="w-full mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
            Your Feedback (Optional)
          </label>
          <textarea
            id="feedback"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell us about your experience with this app..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-600 mb-4">
            {errorMessage}
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors disabled:bg-indigo-400"
          onClick={handleRatingSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </div>
    </section>
  );
};

export default RatingSection;
