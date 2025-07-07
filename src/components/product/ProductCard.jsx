// folioxe/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
            {typeof price === 'number' ? `$${price.toFixed(2)}` : price}
          </p>
        </div>
      {/* Add to Cart Button */}
        <button
          onClick={async () => {
            if (!isAuthenticated) {
              await Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please log in to add products to your cart.',
                confirmButtonText: 'Go to Login',
                confirmButtonColor: '#2563eb',
              });
              navigate('/login');
              return;
            }
            // Ensure product has an id for cart logic
            const cartProduct = { ...product, id: product.id || product.slug };
            addToCart(cartProduct);
            Swal.fire({
              icon: 'success',
              title: 'Added to Cart',
              text: `${product.title || product.name} has been added to your cart!`,
              timer: 1200,
              showConfirmButton: false,
              position: 'top-end',
              toast: true,
            });
          }}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;