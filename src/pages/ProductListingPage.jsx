import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard.jsx';
import { db } from '../firebase.js';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useUserRole } from '../contexts/UserRoleContext.jsx';

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyProducts, setShowMyProducts] = useState(false);
  
  // Get current user and role info
  const { user } = useAuth();
  const { isSeller } = useUserRole();

  // Filtering and sorting state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let q;
        
        if (showMyProducts && isSeller() && user?.uid) {
          // Only show products submitted by the current seller
          q = query(
            collection(db, 'products'),
            where('authorId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Show all products
          q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products from Firestore:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showMyProducts, user?.uid]); // Re-fetch when showMyProducts or user changes

  // Get unique categories from products
  const categories = ['All', ...Array.from(
    new Set(
      products.map(p => p.category).filter(Boolean)
    )
  )];

  // Filtering (category and search)
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const lowerQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = lowerQuery === '' ||
      (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
      (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery));
    return matchesCategory && matchesSearch;
  });

  // Helper to get a comparable timestamp from createdAt
  function getTimestamp(val) {
    if (!val) return 0;
    if (typeof val === 'object' && typeof val.toMillis === 'function') return val.toMillis();
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const d = new Date(val);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }
    if (val instanceof Date) return val.getTime();
    return 0;
  }

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return (a.price || 0) - (b.price || 0);
      case 'price-desc':
        return (b.price || 0) - (a.price || 0);
      case 'name-asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-desc':
        return (b.name || '').localeCompare(a.name || '');
      case 'date-asc':
        return getTimestamp(a.createdAt) - getTimestamp(b.createdAt);
      case 'date-desc':
      default:
        return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    }
  });

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOption, searchQuery, showMyProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Seller-only toggle */}
      {isSeller() && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowMyProducts(!showMyProducts)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showMyProducts 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            {showMyProducts ? 'View All Products' : 'View My Products'}
          </button>
        </div>
      )}

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {showMyProducts ? 'My Products' : 'Explore Our Products'}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {showMyProducts 
            ? 'Manage your product listings' 
            : 'Find the perfect assets for your next creative project'}
        </p>
      </header>

      {/* Filter, Sort, and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label htmlFor="category" className="mr-2 font-medium text-gray-800 dark:text-gray-200">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="border rounded px-2 py-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label htmlFor="sort" className="mr-2 font-medium text-gray-800 dark:text-gray-200">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label htmlFor="search" className="mr-2 font-medium text-gray-800 dark:text-gray-200">Search:</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="border rounded px-2 py-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.slug || product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex items-center space-x-1" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border-t border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${
                      page === currentPage ? 'font-bold bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {showMyProducts 
              ? "You haven't submitted any products yet." 
              : "No products found matching your criteria."}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;