import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalReviews: 0,
    totalRevenue: 0,
    pendingProducts: 0,
    pendingReviews: 0,
    bannedUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch all collections
      const [usersSnapshot, productsSnapshot, reviewsSnapshot] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'reviews'))
      ]);

      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate statistics
      const totalUsers = users.length;
      const totalProducts = products.length;
      const totalReviews = reviews.length;
      const pendingProducts = products.filter(p => !p.approved).length;
      const pendingReviews = reviews.filter(r => !r.approved).length;
      const bannedUsers = users.filter(u => u.banned).length;
      
      // Calculate revenue (assuming each product has a price)
      const totalRevenue = products.reduce((sum, product) => sum + (product.price || 0), 0);

      setStats({
        totalUsers,
        totalProducts,
        totalReviews,
        totalRevenue,
        pendingProducts,
        pendingReviews,
        bannedUsers
      });

      // Generate recent activity
      const activity = generateRecentActivity(users, products, reviews);
      setRecentActivity(activity);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (users, products, reviews) => {
    const activity = [];

    // Add recent user registrations
    users.slice(0, 5).forEach(user => {
      activity.push({
        type: 'user',
        action: 'registered',
        title: `New user: ${user.email}`,
        timestamp: user.createdAt?.toDate() || new Date(),
        icon: Users
      });
    });

    // Add recent product submissions
    products.slice(0, 5).forEach(product => {
      activity.push({
        type: 'product',
        action: product.approved ? 'approved' : 'submitted',
        title: `Product: ${product.title}`,
        timestamp: product.createdAt?.toDate() || new Date(),
        icon: Package
      });
    });

    // Add recent reviews
    reviews.slice(0, 5).forEach(review => {
      activity.push({
        type: 'review',
        action: review.approved ? 'approved' : 'submitted',
        title: `Review for: ${review.productTitle}`,
        timestamp: review.createdAt?.toDate() || new Date(),
        icon: MessageSquare
      });
    });

    // Sort by timestamp and return top 10
    return activity
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'All time';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your platform's performance and growth
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="btn-primary flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Users</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalUsers}</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>
                +{getGrowthRate(stats.totalUsers, Math.floor(stats.totalUsers * 0.9))}% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e40af' }}>
              <Users className="w-6 h-6" style={{ color: '#60a5fa' }} />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Products</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalProducts}</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>
                +{getGrowthRate(stats.totalProducts, Math.floor(stats.totalProducts * 0.85))}% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#166534' }}>
              <Package className="w-6 h-6" style={{ color: '#6ee7b7' }} />
            </div>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Reviews</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalReviews}</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>
                +{getGrowthRate(stats.totalReviews, Math.floor(stats.totalReviews * 0.8))}% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#7c3aed' }}>
              <MessageSquare className="w-6 h-6" style={{ color: '#c4b5fd' }} />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Total Revenue</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs" style={{ color: '#22c55e' }}>
                +{getGrowthRate(stats.totalRevenue, Math.floor(stats.totalRevenue * 0.75))}% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ca8a04' }}>
              <DollarSign className="w-6 h-6" style={{ color: '#fde68a' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Items */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Items</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Products</span>
              <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.pendingProducts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reviews</span>
              <span className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.pendingReviews}
              </span>
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {stats.totalUsers - stats.bannedUsers}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Banned Users</span>
              <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                {stats.bannedUsers}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {stats.totalProducts > 0 ? Math.round(((stats.totalProducts - stats.pendingProducts) / stats.totalProducts) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Review Rate</span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {stats.totalReviews > 0 ? Math.round(((stats.totalReviews - stats.pendingReviews) / stats.totalReviews) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.action} • {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            {/* User Growth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">User Growth</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">+12.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Product Growth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product Growth</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">+8.3%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Review Growth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Review Growth</span>
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">+15.2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Revenue Growth */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue Growth</span>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">+22.1%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="card p-6" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Download analytics data for external analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button className="btn-primary flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 