// folioxe/src/contexts/BalanceContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setBalance(null);
      setLoading(false);
      return;
    }

    let unsubscribe;

    const fetchBalance = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        
        unsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            // Check for both possible balance locations
            const userBalance = userData.balance ?? 
                               (userData.sellerProfile?.balance ?? 0);
            setBalance(Number(userBalance));
          } else {
            setBalance(0);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching balance:", error);
          setError("Failed to load balance");
          setLoading(false);
        });

      } catch (error) {
        console.error("Error setting up balance listener:", error);
        setError("Error setting up balance listener");
        setLoading(false);
      }
    };

    fetchBalance();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.uid]);

  const value = {
    balance,
    loading,
    error
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};