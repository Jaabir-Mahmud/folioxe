import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('folioxe-cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('folioxe-cart', JSON.stringify(cart));
  }, [cart]);

  // Add product or increment quantity
  const addToCart = (product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        // Already in cart, increment quantity
        return prev.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // New item
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Remove product completely
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Cart summary
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalUniqueItems = cart.length;
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalUniqueItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
