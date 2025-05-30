// folioxe/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase.js'; // Import Firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore functions

// StarRating component can remain as is, or be moved to a separate file
const StarRating = ({ rating, reviewsCount }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0; // This logic for half star is simplistic
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .09l2.939 5.865 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {/* Add more sophisticated half/empty star rendering if needed */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 dark:text-gray-600 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 .09l2.939 5.865 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
      ))}
      {reviewsCount > 0 && <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({reviewsCount} reviews)</span>}
    </div>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams(); // Get the 'slug' from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setLoading(false);
        setError("No product slug provided.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const productsCollectionRef = collection(db, "products");
        // Query for the product with the matching slug
        // Note: For this query to be efficient in Firestore, you'll need to create an index
        // on the 'slug' field in your 'products' collection. Firestore will usually prompt you
        // with a link in the console error message if an index is needed.
        const q = query(productsCollectionRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No product found with slug:", slug);
          setProduct(null); // Explicitly set to null if not found
        } else {
          // Assuming slugs are unique, there should be only one document
          const docData = querySnapshot.docs[0].data();
          setProduct({ id: querySnapshot.docs[0].id, ...docData });
          console.log("Product fetched from Firestore:", { id: querySnapshot.docs[0].id, ...docData });
        }
      } catch (err) {
        console.error("Error fetching product from Firestore:", err);
        setError("Failed to load product details. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]); // Re-run effect if slug changes

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
        <Link to="/products" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Product Not Found!</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the product with slug: {slug}
        </p>
        <Link 
          to="/products" 
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  // Product is found, render its details
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery (Simplified) */}
        <div className="w-full aspect-[4/3] md:aspect-square rounded-lg overflow-hidden shadow-lg">
          <img 
            src={product.imageUrl || '/images/generic_image_error.jpg'} // Fallback if imageUrl is missing
            alt={product.title} 
            className="w-full h-full object-cover"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = '/images/generic_image_error.jpg'; 
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Link 
            to="/products" 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
          >
            &larr; Back to Products
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {product.title}
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-400 mb-3">
            By <span className="font-semibold text-gray-700 dark:text-gray-300">{product.authorName || product.author}</span> in <span className="font-semibold text-gray-700 dark:text-gray-300">{product.category}</span>
          </p>

          <div className="mb-4">
            <StarRating rating={product.rating || 0} reviewsCount={product.reviewsCount || 0} />
          </div>

          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            ${parseFloat(product.price).toFixed(2)} {/* Ensure price is formatted */}
          </p>

          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-6 text-gray-700 dark:text-gray-300">
            <p>{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          {product.demoUrl && (
            <div className="mb-6">
                <a 
                    href={product.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                    View Live Demo &rarr;
                </a>
            </div>
          )}

          <button 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Add to Cart / Purchase {/* Placeholder Action */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;