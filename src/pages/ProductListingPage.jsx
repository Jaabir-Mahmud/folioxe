// folioxe/src/pages/ProductListingPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard.jsx';
import { db } from '../firebase.js'; // Import Firestore instance
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // Firestore functions

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsCollectionRef = collection(db, "products");
        // You can order the products, e.g., by creation time (descending)
        const q = query(productsCollectionRef, orderBy("createdAt", "desc")); 
        const querySnapshot = await getDocs(q);

        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // Get the document ID from Firestore
          ...doc.data() // Get the rest of the product data
        }));

        setProducts(productsData);
        console.log("Products fetched from Firestore:", productsData);
      } catch (err) {
        console.error("Error fetching products from Firestore:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading products...</p>
        {/* You can add a spinner here */}
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
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Explore Our Products
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Find the perfect assets for your next creative project.
        </p>
      </header>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            // Ensure ProductCard uses product.id for key if slugs might not be unique
            // or if you plan to use Firestore doc ID as the primary identifier for links later.
            // For now, if slug is unique and used for navigation, it's fine.
            <ProductCard key={product.slug || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No products found. Why not submit one?
          </p>
          {/* You could add a Link to the submit product page here */}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;