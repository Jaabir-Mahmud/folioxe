import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useUserRole } from '../contexts/UserRoleContext.jsx';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { storage as appwriteStorage } from '../appwriteClient.js';

const APPWRITE_ASSET_BUCKET_ID = '683a18bc0017007f6313';

const categories = [
  "Portfolio", 
  "WordPress Theme", 
  "UI Kit", 
  "Branding", 
  "Web Template", 
  "Icon Set", 
  "Other"
];

const SellerDashboardPage = () => {
  const { user } = useAuth();
  const { isSeller, isAdmin } = useUserRole();

  // Redirect if not authorized
  if (!isSeller() && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    tags: '',
    demoUrl: ''
  });

  // Fetch user's products
  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setError('');
        const q = query(
          collection(db, 'products'), 
          where('authorId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const userProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setProducts(userProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [user?.uid]);

  // Delete product handlers
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      // Delete files from storage
      const deletePromises = [];
      if (productToDelete.thumbnailFileId) {
        deletePromises.push(
          appwriteStorage.deleteFile(APPWRITE_ASSET_BUCKET_ID, productToDelete.thumbnailFileId)
            .catch(err => console.error('Error deleting thumbnail:', err))
        );
      }
      if (productToDelete.mainFileId) {
        deletePromises.push(
          appwriteStorage.deleteFile(APPWRITE_ASSET_BUCKET_ID, productToDelete.mainFileId)
            .catch(err => console.error('Error deleting main file:', err))
        );
      }
      
      await Promise.all(deletePromises);
      await deleteDoc(doc(db, 'products', productToDelete.id));
      
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setDeleteModalOpen(false);
      setSuccess(`"${productToDelete.title}" deleted successfully`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Edit product handlers
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setEditForm({
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      tags: product.tags?.join(', ') || '',
      demoUrl: product.demoUrl || ''
    });
    setEditModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!productToEdit) return;

    setEditLoading(true);
    try {
      // Validate form
      if (!editForm.title.trim()) throw new Error('Title is required');
      if (!editForm.category) throw new Error('Category is required');
      const price = parseFloat(editForm.price);
      if (isNaN(price) || price < 0) throw new Error('Invalid price');

      // Prepare update data
      const updateData = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        price: price,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        demoUrl: editForm.demoUrl.trim(),
        updatedAt: serverTimestamp()
      };

      // Update in Firestore
      await updateDoc(doc(db, 'products', productToEdit.id), updateData);

      // Update local state
      setProducts(products.map(p => 
        p.id === productToEdit.id ? { ...p, ...updateData } : p
      ));

      // Close modal and show success
      setEditModalOpen(false);
      setSuccess(`"${updateData.title}" updated successfully`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Seller Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your products and track your sales
          </p>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg dark:bg-green-900 dark:text-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Products Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {products.length}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                {/* Icon */}
              </div>
            </div>
          </div>

          {/* Views Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">-</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                {/* Icon */}
              </div>
            </div>
          </div>

          {/* Sales Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">-</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                {/* Icon */}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Products</h2>
            <Link 
              to="/submit-product" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Add New Product
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">You haven't submitted any products yet.</p>
              <Link 
                to="/submit-product" 
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Submit Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-lg object-cover" 
                              src={product.imageUrl || '/images/placeholder.jpg'} 
                              alt={product.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ${product.price?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/product/${product.slug}`} 
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          View
                        </Link>
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 mr-4"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{productToDelete?.title}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteLoading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Product
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              {/* Other form fields... */}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  {editLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;