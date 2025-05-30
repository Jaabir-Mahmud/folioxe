// folioxe/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

const ProductCard = ({ product }) => {
  const {
    imageUrl = 'https://via.placeholder.com/400x300.png?text=Product+Image',
    title = 'Awesome Product Title',
    category = 'Category',
    author = 'Creative Studio',
    price = '$XX.XX',
    slug = 'default-product-slug', // Ensure a fallback slug
  } = product || {};

  const productDetailUrl = `/product/${slug}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 group">
      <Link to={productDetailUrl} className="block"> {/* 2. Link for the image */}
        <div className="relative pb-[75%]"> {/* Aspect ratio box for image (4:3) */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={imageUrl}
            alt={title}
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300.png?text=Image+Error'; }}
          />
        </div>
      </Link>

      <div className="p-5">
        <Link to={productDetailUrl} className="block"> {/* 3. Link for the title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-2 uppercase tracking-wider">
            {category}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {author}
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {price}
          </p>
        </div>
        {/* Optional: If you want a dedicated "View Details" button later
        <div className="mt-4">
          <Link 
            to={productDetailUrl}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View Details &rarr;
          </Link>
        </div>
        */}
      </div>
    </div>
  );
};

export default ProductCard;