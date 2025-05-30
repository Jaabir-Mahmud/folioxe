// folioxe/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const {
    imageUrl = '/src/assets/image/default1.jpg', // Default local image
    title = 'Awesome Product Title',
    category = 'Category',
    author = 'Creative Studio',
    price = '$XX.XX',
    slug = 'default-product-slug',
  } = product || {};

  const productDetailUrl = `/product/${slug}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 group">
      <Link to={productDetailUrl} className="block">
        <div className="relative pb-[75%]"> {/* Aspect ratio 4:3 */}
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={imageUrl}
            alt={title}
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'src/assets/image/default2.jpg'; // Fallback to local error image
            }}
          />
        </div>
      </Link>

      <div className="p-5">
        {/* ... rest of the card content ... */}
        <Link to={productDetailUrl} className="block">
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
      </div>
    </div>
  );
};

export default ProductCard;