import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProductCard from '../components/product/ProductCard.jsx';
import { db } from '../firebase.js';
import { collection, getDocs, query, orderBy, where, limit, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Features data
const features = [
  {
    title: "Portfolio Templates",
    desc: "Stunning, modern templates to showcase your work professionally.",
    icon: (
      <svg className="w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a2 2 0 012-2h14a2 2 0 012 2v1M3 7v11a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
      </svg>
    )
  },
  {
    title: "Website Themes",
    desc: "Beautifully designed themes for various platforms and needs.",
    icon: (
      <svg className="w-10 h-10 text-purple-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    )
  },
  {
    title: "Brand Kits",
    desc: "Complete branding packages to kickstart your identity.",
    icon: (
      <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    )
  }
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewError, setReviewError] = useState(null);

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(null);
  const [checkPurchaseLoading, setCheckPurchaseLoading] = useState(true);

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const productsCollectionRef = collection(db, "products");
      const q = query(productsCollectionRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setProducts(productsData);
    } catch (err) {
      console.error("Products fetch error:", err);
      setProductsError("Failed to load products. Please try again later.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewError(null);
    try {
      const reviewsCollectionRef = collection(db, "reviews");

      let reviewsData = [];
      try {
        const approvedQuery = query(
          reviewsCollectionRef,
          where("approved", "==", true),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const approvedSnapshot = await getDocs(approvedQuery);
        reviewsData = approvedSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
      } catch (approvedError) {
        console.log('Approved query failed, trying basic query...', approvedError);
        const basicQuery = query(reviewsCollectionRef, limit(10));
        const basicSnapshot = await getDocs(basicQuery);
        const allReviews = basicSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        reviewsData = allReviews.filter(review => review.approved === true);
      }

      setReviews(reviewsData);
    } catch (err) {
      console.error("Review fetch error:", err.message);
      let errorMessage = "Failed to load reviews.";
      if (err.code === 'permission-denied') {
        errorMessage = "Reviews are temporarily unavailable.";
        setReviews([]);
      }
      setReviewError(errorMessage);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

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
  

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError('Please sign in to leave a review');
      return;
    }

    if (!reviewText.trim()) {
      setSubmitError('Please enter a review');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const hasPurchases = await checkUserPurchases(user.uid);
      if (!hasPurchases) {
        setSubmitError('Only customers who have made purchases can leave reviews');
        return;
      }

      const reviewsRef = collection(db, 'reviews');
      await addDoc(reviewsRef, {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        userPhoto: user.photoURL || '',
        text: reviewText.trim(),
        rating: parseInt(rating),
        createdAt: new Date(),
        approved: false
      });

      setSubmitSuccess(true);
      setReviewText('');
      setRating(5);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Review submission error:", error);
      let errorMessage = 'Failed to submit review. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to submit reviews.';
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.allSettled([fetchProducts(), fetchReviews()]);
    };
    fetchData();
  }, [fetchProducts, fetchReviews]);

  // Check purchase status after login
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      checkUserPurchases();
    }
  }, [isAuthenticated, user?.uid]);

  // Debug: log current user UID
  useEffect(() => {
    console.log('[DEBUG] useEffect running: authLoading, user:', authLoading, user?.uid);
    if (!authLoading && user) {
      checkUserPurchases();
    }
  }, [authLoading, user, checkUserPurchases]);

  // Helper: Render reviews content
  const renderReviewsContent = () => {
    if (reviewsLoading) {
      return (
        <div className="text-center py-5">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      );
    }
    if (reviewError) {
      return (
        <div className="text-center py-5">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-500 mb-3">{reviewError}</p>
          <button onClick={fetchReviews}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300">
            Retry
          </button>
        </div>
      );
    }
    if (reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
        </div>
      );
    }

    return (
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className="py-8"
      >
        {reviews.map(review => (
          <SwiperSlide key={review.id}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full mx-2">
              <div className="flex items-center mb-4">
                {review.userPhoto ? (
                  <img src={review.userPhoto} alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover mr-3" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <span className="text-xl font-medium text-blue-600 dark:text-blue-300">
                      {review.userName ? review.userName.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    {review.userName || 'Anonymous'}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {review.text}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {review.createdAt?.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  // Memoize products by category
  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      const cat = product.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});
  }, [products]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 bg-opacity-30 rounded-full filter blur-3xl animate-blob -z-10" style={{ animationDelay: '0s' }} />
      <div className="absolute top-20 right-0 w-80 h-80 bg-purple-400 bg-opacity-20 rounded-full filter blur-3xl animate-blob -z-10" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-300 bg-opacity-20 rounded-full filter blur-3xl animate-blob -z-10" style={{ animationDelay: '4s' }} />

      {/* Hero Section */}
      <header className="text-center pt-24 pb-16 relative z-10">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-lg">
          Discover. Create. <span className="text-blue-600 dark:text-blue-400">Inspire.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
          Welcome to <span className="font-bold text-blue-600 dark:text-blue-400">FolioXe</span> — your one-stop platform to find, share, and sell creative digital assets.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <a href="/browse" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg">
            Explore Assets
          </a>
          <a href="/signup" className="bg-white dark:bg-gray-900 border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 text-lg">
            Join as Seller
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="my-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">What We Offer</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">
            Explore a wide range of high-quality digital products.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border-t-4 border-blue-100 dark:border-blue-900 hover:scale-105 hover:shadow-blue-200 dark:hover:shadow-blue-900 transition-transform duration-300"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className="flex flex-col items-center">
                {f.icon}
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                  {f.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products by Category Section */}
      <section className="my-24 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 text-center">Featured Products by Category</h2>
        {productsLoading ? (
          <div className="text-center py-10 text-lg text-gray-500 dark:text-gray-400">Loading products...</div>
        ) : productsError ? (
          <div className="text-center py-10 text-lg text-red-500 dark:text-red-400">{productsError}</div>
        ) : Object.keys(productsByCategory).length === 0 ? (
          <div className="text-center py-10 text-lg text-gray-500 dark:text-gray-400">No products available.</div>
        ) : (
          Object.entries(productsByCategory).map(([category, prods]) => (
            <div key={category} className="mb-16">
              <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 mb-6">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {prods.slice(0, 4).map(product => (
                  <ProductCard key={product.slug || product.id} product={product} />
                ))}
              </div>
              {prods.length > 4 && (
                <div className="text-right mt-2">
                  <a href={`/browse?category=${encodeURIComponent(category)}`} className="text-blue-600 hover:underline font-medium">View all {category} products &rarr;</a>
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* Reviews Section */}
      <section className="my-24 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 text-center">
          What Our Customers Say
        </h2>
        {renderReviewsContent()}
      </section>

      {/* Review Button / Modal Trigger */}
      {!isAuthenticated && (
        <section className="max-w-6xl mx-auto px-4 my-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Want to Leave a Review?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please sign in to share your feedback.
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Sign In to Review
            </a>
          </div>
        </section>
      )}

      {isAuthenticated && checkPurchaseLoading && (
        <div className="text-center my-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Checking purchase history...</p>
        </div>
      )}

      {isAuthenticated && !checkPurchaseLoading && !hasPurchased && (
        <section className="max-w-6xl mx-auto px-4 my-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Leave a Review
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Only verified customers who have made purchases can leave reviews.
            </p>
          </div>
        </section>
      )}

      {isAuthenticated && !checkPurchaseLoading && hasPurchased && (
        <section className="max-w-6xl mx-auto px-4 my-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Leave Your Feedback
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Share your experience as a customer!
            </p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Leave a Review
            </button>
          </div>
        </section>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-lg w-full relative animate-scale-fade">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="4"
                  placeholder="Share your thoughts about our products..."
                  required
                />
              </div>
              {submitError && (
                <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded text-center">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded text-center">
                  Thank you! Your review has been submitted successfully.
                </div>
              )}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition duration-300 disabled:opacity-50"
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
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadein.delay-200 { animation-delay: .2s; }
        .animate-fadein.delay-300 { animation-delay: .3s; }
        @keyframes blob { 0%,100%{transform:translateY(0) scale(1);} 33%{transform:translateY(-20px) scale(1.1);} 66%{transform:translateY(10px) scale(0.95);} }
        .animate-blob { animation: blob 12s infinite ease-in-out; }
        @keyframes scaleFade { 0% {opacity: 0; transform: scale(0.95);} 100% {opacity: 1; transform: scale(1);} }
        .animate-scale-fade { animation: scaleFade 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HomePage;