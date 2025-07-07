import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Eye,
  Star,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Flag
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Swal.fire('Error', 'Failed to fetch reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { 
        approved: true, 
        approvedAt: new Date() 
      });
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, approved: true } : review
      ));
      Swal.fire('Success', 'Review approved successfully', 'success');
    } catch (error) {
      console.error('Error approving review:', error);
      Swal.fire('Error', 'Failed to approve review', 'error');
    }
  };

  const rejectReview = async (reviewId) => {
    try {
      const result = await Swal.fire({
        title: 'Reject Review?',
        text: "This action cannot be undone. The review will be permanently deleted.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, reject it!'
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, 'reviews', reviewId));
        setReviews(reviews.filter(review => review.id !== reviewId));
        Swal.fire('Rejected!', 'Review has been rejected and deleted.', 'success');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      Swal.fire('Error', 'Failed to reject review', 'error');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.productTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' ? review.approved : !review.approved);
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getStatusBadgeColor = (approved) => {
    return approved 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400';
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Moderate and manage user reviews
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredReviews.length} of {reviews.length} reviews
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchReviews}
            className="btn-primary flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="card p-6 hover:shadow-lg transition-shadow" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Review Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {review.userEmail?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.userEmail}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {review.createdAt?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(review.approved)}`}>
                      {review.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Review for: {review.productTitle}
                  </h5>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                    {review.rating}/5
                  </span>
                </div>

                {/* Review Comment */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedReview(review);
                      setShowReviewModal(true);
                    }}
                    className="btn-secondary flex items-center justify-center text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  {!review.approved && (
                    <>
                      <button
                        onClick={() => approveReview(review.id)}
                        className="btn-success flex items-center justify-center text-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectReview(review.id)}
                        className="btn-danger flex items-center justify-center text-sm"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {showReviewModal && selectedReview && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Review Details
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Review Header */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-xl font-medium text-blue-600 dark:text-blue-400">
                      {selectedReview.userEmail?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedReview.userEmail}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedReview.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Product: {selectedReview.productTitle}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Product ID: {selectedReview.productId}
                  </p>
                </div>

                {/* Rating */}
                <div>
                  <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Rating</h6>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className={`text-lg font-medium ${getRatingColor(selectedReview.rating)}`}>
                      {selectedReview.rating}/5
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <h6 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Review</h6>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {selectedReview.comment}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Flag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(selectedReview.approved)}`}>
                      {selectedReview.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  
                  {selectedReview.approved && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approved:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedReview.approvedAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    {!selectedReview.approved ? (
                      <>
                        <button
                          onClick={() => {
                            approveReview(selectedReview.id);
                            setShowReviewModal(false);
                          }}
                          className="flex-1 btn-success flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            rejectReview(selectedReview.id);
                            setShowReviewModal(false);
                          }}
                          className="flex-1 btn-danger flex items-center justify-center"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="flex-1 btn-secondary"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews; 