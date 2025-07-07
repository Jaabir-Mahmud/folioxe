import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import successAnimation from '../assets/animations/success.json';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext.jsx';

const DownloadSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();

  useEffect(() => {
    // Record purchase in Firestore
    const recordPurchase = async () => {
      if (!user) return;
      try {
        await addDoc(collection(db, 'purchases'), {
          userId: user.uid,
          items: cart.map(({ product }) => ({ id: product.id, name: product.title || product.name })),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        // Optionally handle error
        console.error('Error recording purchase:', err);
      }
    };
    recordPurchase();
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user, cart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-64 h-64 mb-8">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Download Successful!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Your files have been downloaded successfully.<br />
        Redirecting to home page...
      </p>
    </div>
  );
};

export default DownloadSuccessPage;
