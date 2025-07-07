import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Star, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalReviews: 0,
    totalRevenue: 0,
    pendingProducts: 0,
    pendingReviews: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => doc.data());
      const totalProducts = productsData.length;
      const pendingProducts = productsData.filter(p => !p.approved).length;

      // Fetch reviews
      const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
      const reviewsData = reviewsSnapshot.docs.map(doc => doc.data());
      const totalReviews = reviewsData.length;
      const pendingReviews = reviewsData.filter(r => !r.approved).length;

      // Fetch purchases for revenue
      const purchasesSnapshot = await getDocs(collection(db, 'purchases'));
      const totalRevenue = purchasesSnapshot.docs.reduce((sum, doc) => {
        return sum + (doc.data().amount || 0);
      }, 0);

      // Fetch recent activity
      const recentActivity = await fetchRecentActivity();

      setStats({
        totalUsers,
        totalProducts,
        totalReviews,
        totalRevenue,
        pendingProducts,
        pendingReviews,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const activities = [];
      
      // Recent products
      const recentProductsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const recentProducts = await getDocs(recentProductsQuery);
      recentProducts.docs.forEach(doc => {
        activities.push({
          type: 'product',
          id: doc.id,
          title: doc.data().title,
          status: doc.data().approved ? 'approved' : 'pending',
          timestamp: doc.data().createdAt?.toDate() || new Date(),
          user: doc.data().submittedBy
        });
      });

      // Recent reviews
      const recentReviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const recentReviews = await getDocs(recentReviewsQuery);
      recentReviews.docs.forEach(doc => {
        activities.push({
          type: 'review',
          id: doc.id,
          title: `Review by ${doc.data().userName}`,
          status: doc.data().approved ? 'approved' : 'pending',
          timestamp: doc.data().createdAt?.toDate() || new Date(),
          user: doc.data().userName
        });
      });

      return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'product':
          return <Package className="w-4 h-4" />;
        case 'review':
          return <Star className="w-4 h-4" />;
        default:
          return <Activity className="w-4 h-4" />;
      }
    };

    const getStatusColor = () => {
      return activity.status === 'approved' ? 'text-green-600' : 'text-yellow-600';
    };

    const getStatusIcon = () => {
      return activity.status === 'approved' ? 
        <CheckCircle className="w-4 h-4" /> : 
        <Clock className="w-4 h-4" />;
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {activity.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            by {activity.user}
          </p>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-xs font-medium capitalize">{activity.status}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to your FolioXe admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
          subtitle="Registered users"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-green-500"
          subtitle={`${stats.pendingProducts} pending approval`}
        />
        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={Star}
          color="bg-yellow-500"
          subtitle={`${stats.pendingReviews} pending approval`}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="bg-purple-500"
          subtitle="From all purchases"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-2">
                {stats.recentActivity.map((activity, index) => (
                  <ActivityItem key={`${activity.type}-${activity.id}-${index}`} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full btn-primary flex items-center justify-center">
              <Package className="w-4 h-4 mr-2" />
              Review Pending Products ({stats.pendingProducts})
            </button>
            <button className="w-full btn-secondary flex items-center justify-center">
              <Star className="w-4 h-4 mr-2" />
              Moderate Reviews ({stats.pendingReviews})
            </button>
            <button className="w-full btn-secondary flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </button>
            <button className="w-full btn-secondary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 