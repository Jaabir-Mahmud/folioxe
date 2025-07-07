import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../contexts/UserRoleContext.jsx';
import { db } from '../firebase.js';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  where,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import Swal from 'sweetalert2';
import { 
  Users, 
  Package, 
  Star, 
  Settings, 
  BarChart3, 
  Shield, 
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Database,
  Activity
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { isAdmin } = useUserRole();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingReviews: 0,
    activeSellers: 0,
    recentActivity: []
  });

  // UI states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchProducts(),
          fetchReviews(),
          fetchPurchases(),
          fetchAnalytics()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Set up real-time listeners
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), () => {
      fetchUsers();
    });

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), () => {
      fetchProducts();
    });

    const unsubscribeReviews = onSnapshot(collection(db, 'reviews'), () => {
      fetchReviews();
    });

    return () => {
      unsubscribeUsers();
      unsubscribeProducts();
      unsubscribeReviews();
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnapshot = await getDocs(q);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const reviewsSnapshot = await getDocs(q);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const q = query(collection(db, 'purchases'), orderBy('createdAt', 'desc'));
      const purchasesSnapshot = await getDocs(q);
      const purchasesData = purchasesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setPurchases(purchasesData);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const reviewsSnapshot = await getDocs(query(collection(db, 'reviews'), where('approved', '==', false)));
      const purchasesSnapshot = await getDocs(collection(db, 'purchases'));

      const totalRevenue = purchasesSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      const activeSellers = productsSnapshot.docs.reduce((sellers, doc) => {
        const sellerId = doc.data().submittedBy;
        if (!sellers.includes(sellerId)) sellers.push(sellerId);
        return sellers;
      }, []);

      setAnalytics({
        totalUsers: usersSnapshot.size,
        totalProducts: productsSnapshot.size,
        totalRevenue: totalRevenue,
        pendingReviews: reviewsSnapshot.size,
        activeSellers: activeSellers.length,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // User Management Functions
  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      Swal.fire('Success', 'User role updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire('Error', 'Failed to update user role', 'error');
    }
  };

  const banUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { 
        banned: true, 
        bannedAt: serverTimestamp() 
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, banned: true } : user
      ));
      Swal.fire('Success', 'User banned successfully', 'success');
    } catch (error) {
      console.error('Error banning user:', error);
      Swal.fire('Error', 'Failed to ban user', 'error');
    }
  };

  const unbanUser = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { 
        banned: false, 
        bannedAt: null 
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, banned: false } : user
      ));
      Swal.fire('Success', 'User unbanned successfully', 'success');
    } catch (error) {
      console.error('Error unbanning user:', error);
      Swal.fire('Error', 'Failed to unban user', 'error');
    }
  };

  // Product Management Functions
  const approveProduct = async (productId) => {
    try {
      await updateDoc(doc(db, 'products', productId), { 
        approved: true, 
        approvedAt: serverTimestamp() 
      });
      setProducts(products.map(product => 
        product.id === productId ? { ...product, approved: true } : product
      ));
      Swal.fire('Success', 'Product approved successfully', 'success');
    } catch (error) {
      console.error('Error approving product:', error);
      Swal.fire('Error', 'Failed to approve product', 'error');
    }
  };

  const rejectProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(products.filter(product => product.id !== productId));
      Swal.fire('Success', 'Product rejected and deleted', 'success');
    } catch (error) {
      console.error('Error rejecting product:', error);
      Swal.fire('Error', 'Failed to reject product', 'error');
    }
  };

  // Review Management Functions
  const approveReview = async (reviewId) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { approved: true });
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
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(reviews.filter(review => review.id !== reviewId));
      Swal.fire('Success', 'Review rejected and deleted', 'success');
    } catch (error) {
      console.error('Error rejecting review:', error);
      Swal.fire('Error', 'Failed to reject review', 'error');
    }
  };

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review => 
    review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600">Complete website control and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-8 mb-8 border-b border-gray-200">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'products', name: 'Products', icon: Package },
            { id: 'reviews', name: 'Reviews', icon: Star },
            { id: 'purchases', name: 'Purchases', icon: DollarSign },
            { id: 'analytics', name: 'Analytics', icon: Activity },
            { id: 'settings', name: 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900">{analytics.totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Total Products</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.totalProducts}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-yellow-900">${analytics.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-red-600">Pending Reviews</p>
                      <p className="text-2xl font-bold text-red-900">{analytics.pendingReviews}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {reviews.slice(0, 5).map(review => (
                      <div key={review.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${review.approved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm text-gray-600">
                          {review.userName} left a {review.approved ? 'approved' : 'pending'} review
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
                    >
                      Review Pending Reviews ({analytics.pendingReviews})
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
                    >
                      Manage Users ({analytics.totalUsers})
                    </button>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
                    >
                      Manage Products ({analytics.totalProducts})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <span className="text-gray-600">Total: {filteredUsers.length} users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.email?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.email}</div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className="rounded border-gray-300 text-sm"
                            value={user.role || 'buyer'}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                          >
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.banned 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.banned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.banned ? (
                            <button
                              onClick={() => unbanUser(user.id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => banUser(user.id)}
                              className="text-red-600 hover:text-red-900 mr-3"
                            >
                              Ban
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <span className="text-gray-600">Total: {filteredProducts.length} products</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={product.imageUrl || '/default-product.jpg'} 
                              alt={product.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.submittedBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!product.approved && (
                            <>
                              <button
                                onClick={() => approveProduct(product.id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectProduct(product.id)}
                                className="text-red-600 hover:text-red-900 mr-3"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowProductModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Review Management</h2>
                <span className="text-gray-600">Total: {filteredReviews.length} reviews</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReviews.map(review => (
                      <tr key={review.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {review.userPhoto ? (
                              <img 
                                src={review.userPhoto} 
                                alt={review.userName}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">
                                  {review.userName?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                              <div className="text-sm text-gray-500">{review.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {review.text}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            review.approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {review.createdAt?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!review.approved && (
                            <>
                              <button
                                onClick={() => approveReview(review.id)}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectReview(review.id)}
                                className="text-red-600 hover:text-red-900 mr-3"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Purchase History</h2>
                <span className="text-gray-600">Total: {purchases.length} purchases</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map(purchase => (
                      <tr key={purchase.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.userId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.productId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${purchase.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {purchase.createdAt?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Analytics & Reports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">User Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-semibold">{analytics.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Sellers:</span>
                      <span className="font-semibold">{analytics.activeSellers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Products:</span>
                      <span className="font-semibold">{analytics.totalProducts}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-semibold">${analytics.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Purchases:</span>
                      <span className="font-semibold">{purchases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value:</span>
                      <span className="font-semibold">
                        ${purchases.length > 0 ? (analytics.totalRevenue / purchases.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">System Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Website Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        defaultValue="FolioXe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@folioxe.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                      Save Settings
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Require Email Verification</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Enable Two-Factor Auth</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-approve Reviews</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                      Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Email:</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">User ID:</label>
                <p className="text-gray-900">{selectedUser.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role:</label>
                <p className="text-gray-900">{selectedUser.role || 'buyer'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <p className="text-gray-900">{selectedUser.banned ? 'Banned' : 'Active'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Joined:</label>
                <p className="text-gray-900">{selectedUser.createdAt?.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={selectedProduct.imageUrl || '/default-product.jpg'} 
                  alt={selectedProduct.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title:</label>
                  <p className="text-gray-900">{selectedProduct.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description:</label>
                  <p className="text-gray-900">{selectedProduct.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category:</label>
                  <p className="text-gray-900">{selectedProduct.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price:</label>
                  <p className="text-gray-900">${selectedProduct.price}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Seller:</label>
                  <p className="text-gray-900">{selectedProduct.submittedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status:</label>
                  <p className="text-gray-900">{selectedProduct.approved ? 'Approved' : 'Pending'}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard; 