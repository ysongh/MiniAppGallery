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
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${review.user}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{formatAddress(review.user)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Number(review.value)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(BigInt(review.timestamp))}
                </span>
              </div>

              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewsList;
