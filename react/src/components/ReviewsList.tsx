import { Star, MessageSquare } from 'lucide-react';

import { formatAddress, formatDate } from '../utils/format';

type Review = {
  user: string;
  rating: number;
  comment: string;
  timestamp: number;
  value: number;
};

const ReviewsList = ({ reviews } : { reviews: Review[]}) => {  
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start">
                  <div className="ml-3">
                    <div className="font-medium text-gray-800">{formatAddress(review.user)}</div>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Number(review ? review.value : 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {review.comment && (
                <div className="text-gray-700 ml-4">
                  {review.comment}
                </div>
              )}
              {review.timestamp && (
                <div className="text-gray-700 ml-4">
                  Post on {formatDate(BigInt(review.timestamp))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsList;
