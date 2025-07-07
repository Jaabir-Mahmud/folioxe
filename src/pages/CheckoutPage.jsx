import React, { useEffect } from 'react';
import { useCart } from '../contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        // Call backend to create Stripe Checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map(({ product, quantity }) => ({
              id: product.id,
              name: product.title || product.name,
              price: product.price,
              quantity,
            })),
          }),
        });
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url; // Redirect to Stripe Checkout
        } else {
          throw new Error('No checkout URL returned');
        }
      } catch (err) {
        alert('Failed to initiate payment: ' + err.message);
        navigate('/cart');
      }
    };
    if (cart.length > 0) {
      createCheckoutSession();
    } else {
      navigate('/cart');
    }
  }, [cart, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting to payment...</h1>
      <p className="text-gray-600 dark:text-gray-300">Please wait while we redirect you to the secure payment page.</p>
    </div>
  );
};

export default CheckoutPage;
