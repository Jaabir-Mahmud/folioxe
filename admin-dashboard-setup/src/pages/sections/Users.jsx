import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Ban, 
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Shield,
  Eye
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

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
        bannedAt: new Date() 
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'banned' ? user.banned : !user.banned);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'seller': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'buyer': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusBadgeColor = (banned) => {
    return banned 
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredUsers.length} of {users.length} users
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchUsers}
            className="btn-primary flex items-center justify-center"
          >
            <UsersIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ backgroundColor: 'var(--table-row-bg)', color: 'var(--text-primary)' }}>
            <thead style={{ backgroundColor: 'var(--table-header-bg)', color: 'var(--text-primary)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ backgroundColor: 'var(--table-row-bg)', color: 'var(--text-primary)' }} className="hover:bg-[#232b3b]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                        <span className="text-sm font-medium" style={{ color: '#fff' }}>
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {user.email}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role || 'buyer'}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${getRoleBadgeColor(user.role || 'buyer')}`}
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.banned)}`}>
                      {user.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {user.createdAt?.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.banned ? (
                        <button
                          onClick={() => unbanUser(user.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Unban User"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => banUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Ban User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 rounded-full" style={{ backgroundColor: '#232b3b', border: '1px solid var(--border-primary)' }}>
                    <span className="text-xl font-medium" style={{ color: '#fff' }}>
                      {selectedUser.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedUser.email}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      User ID: {selectedUser.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Role:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getRoleBadgeColor(selectedUser.role || 'buyer')}`}>
                      {selectedUser.role || 'buyer'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeColor(selectedUser.banned)}`}>
                      {selectedUser.banned ? 'Banned' : 'Active'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedUser.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                  
                  {selectedUser.banned && (
                    <div className="flex items-center space-x-2">
                      <Ban className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Banned:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedUser.bannedAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setShowUserModal(false);
                        // Add edit functionality here
                      }}
                      className="flex-1 btn-secondary flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit User
                    </button>
                    {selectedUser.banned ? (
                      <button
                        onClick={() => {
                          unbanUser(selectedUser.id);
                          setShowUserModal(false);
                        }}
                        className="flex-1 btn-success flex items-center justify-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          banUser(selectedUser.id);
                          setShowUserModal(false);
                        }}
                        className="flex-1 btn-danger flex items-center justify-center"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Ban
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

export default Users; 