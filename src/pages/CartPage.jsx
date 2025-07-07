import React from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">Your cart is empty.</p>
          <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 mb-8">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <img src={product.imageUrl || '/src/assets/image/default1.jpg'} alt={product.title || product.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{product.title || product.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">by {product.authorName || product.author}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="px-2 text-lg">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-lg font-bold"
                  >+</button>
                </div>
                <div className="w-24 text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">${(product.price * quantity).toFixed(2)}</p>
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Remove Item?',
                        text: `Remove ${product.title || product.name} from your cart?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Remove',
                        cancelButtonText: 'Cancel',
                      });
                      if (result.isConfirmed) {
                        removeFromCart(product.id);
                        Swal.fire({
                          icon: 'success',
                          title: 'Removed',
                          text: `${product.title || product.name} removed from cart.`,
                          timer: 1200,
                          showConfirmButton: false,
                          position: 'top-end',
                          toast: true,
                        });
                      }
                    }}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
                  >Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Clear Cart?',
                  text: 'Are you sure you want to remove all items from your cart?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#d33',
                  cancelButtonColor: '#3085d6',
                  confirmButtonText: 'Clear Cart',
                  cancelButtonText: 'Cancel',
                });
                if (result.isConfirmed) {
                  clearCart();
                  Swal.fire({
                    icon: 'success',
                    title: 'Cart Cleared',
                    text: 'All items have been removed from your cart.',
                    timer: 1200,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true,
                  });
                }
              }}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Cart
            </button>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              Subtotal: ${subtotal.toFixed(2)}
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition-colors"
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:5001/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      items: cart.map(({ product, quantity }) => ({
                        name: product.title || product.name,
                        price: product.price,
                        quantity,
                      }))
                    })
                  });
                  const data = await response.json();
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Stripe Error',
                      text: data.error || 'Could not initiate payment.',
                    });
                  }
                } catch (err) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: err.message,
                  });
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
