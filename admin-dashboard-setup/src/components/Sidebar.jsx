import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Package, 
  Star, 
  Settings, 
  X, 
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Overview',
      icon: BarChart3,
      description: 'Dashboard overview and stats'
    },
    {
      path: '/dashboard/users',
      name: 'Users',
      icon: Users,
      description: 'Manage user accounts and roles'
    },
    {
      path: '/dashboard/products',
      name: 'Products',
      icon: Package,
      description: 'Approve and manage products'
    },
    {
      path: '/dashboard/reviews',
      name: 'Reviews',
      icon: Star,
      description: 'Moderate user reviews'
    },
    {
      path: '/dashboard/analytics',
      name: 'Analytics',
      icon: TrendingUp,
      description: 'View detailed analytics'
    },
    {
      path: '/dashboard/settings',
      name: 'Settings',
      icon: Settings,
      description: 'System configuration'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">FolioXe</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full sidebar-link ${isActive ? 'active' : ''}
                `}
                title={item.description}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Admin Dashboard v1.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 