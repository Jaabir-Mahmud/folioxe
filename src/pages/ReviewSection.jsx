import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useSearchParams } from 'react-router-dom';
import { db } from '../firebase.js';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const ReviewSection = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation(); // ✅ to watch URL change
  const [ setSearchParams] = useSearchParams();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(null);
  const [checkPurchaseLoading, setCheckPurchaseLoading] = useState(true);

  // Check if user has made any purchases
  const checkUserPurchases = useCallback(async () => {
    if (!user?.uid) {
      console.log('[DEBUG] checkUserPurchases: No user');
      return false;
    }
    setCheckPurchaseLoading(true);
    try {
      const purchasesRef = collection(db, 'purchases');
      const q = query(purchasesRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      console.log('[DEBUG] Firestore query for purchases, userId:', user.uid, 'docs found:', snapshot.size);
      const hasPurchase = !snapshot.empty;
      setHasPurchased(hasPurchase);
      console.log('[DEBUG] hasPurchased:', hasPurchase);
      return hasPurchase;
    } catch (error) {
      console.error('[DEBUG] Error checking purchases:', error);
      setHasPurchased(false);
      return false;
    } finally {
      setCheckPurchaseLoading(false);
    }
  }, [user?.uid]);

  // Check purchase status after login
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      checkUserPurchases();
    }
  }, [isAuthenticated, user?.uid, checkUserPurchases]);

  // ✅ Check if form should open from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openForm = params.get('openForm');
    if (openForm === 'true') {
      setShowReviewForm(true);
      // Remove the parameter from URL after opening
      params.delete('openForm');
      setSearchParams(params, { replace: true });
    }
  }, [location.search, setSearchParams]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError('Please sign in to leave a review');
      return;
    }

    if (rating === 0 || review.trim() === '') {
      setSubmitError('Please provide both a rating and review text');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const hasPurchases = await checkUserPurchases();
      if (!hasPurchases) {
        setSubmitError('Only customers who have made purchases can leave reviews');
        return;
      }

      const reviewsRef = collection(db, 'reviews');
      await addDoc(reviewsRef, {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL || '',
        text: review.trim(),
        rating: parseInt(rating),
        createdAt: new Date(),
        approved: false
      });

      // Success - reset form
      setRating(0);
      setReview('');
      setShowReviewForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting review:', error);
      let errorMessage = 'Failed to submit review. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to submit reviews.';
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }) => (
    <div className="flex justify-center mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`text-2xl transition-colors ${
            star <= rating
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-2xl mx-auto mt-12 text-center">
      {isAuthenticated ? (
        <>
          {checkPurchaseLoading ? (
            <div className="text-center py-5">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-500">Checking purchase history...</p>
            </div>
          ) : !hasPurchased ? (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Leave a Review
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Only verified customers who have made purchases can leave reviews.
              </p>
            </div>
          ) : !showReviewForm ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Leave a Review
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Share your experience with our products and services.
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                onClick={() => setShowReviewForm(true)}
              >
                Write Review
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Write Your Review
              </h3>
              <form onSubmit={handleSubmitReview} className="text-left">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating
                  </label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {rating === 0
                      ? 'Click to rate'
                      : `You rated ${rating} star${rating > 1 ? 's' : ''}`}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us about your experience..."
                    required
                  />
                </div>

                {submitError && (
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded text-center mb-4">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded text-center mb-4">
                    Thank you! Your review has been submitted successfully.
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setRating(0);
                      setReview('');
                      setSubmitError(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || review.trim() === ''}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : 'Submit Review'}
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Want to Leave a Review?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in to share your experience with our products and services.
          </p>
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
          >
            Sign In
          </a>
        </>
      )}
    </div>
  );
};

export default ReviewSection;
