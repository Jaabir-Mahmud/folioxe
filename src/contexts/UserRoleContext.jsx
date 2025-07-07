import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path is correct for your project
import { useAuth } from './AuthContext'; // Ensure this path is correct

const UserRoleContext = createContext();

export const useUserRole = () => {
  const { userRole, loading } = useContext(UserRoleContext);

  // Always return false if loading or userRole is not set
  const isBuyer = () => {
    if (loading || !userRole) return false;
    return userRole === 'buyer';
  };

  const isSeller = () => {
    if (loading || !userRole) return false;
    return userRole === 'seller';
  };

  const isAdmin = () => {
    if (loading || !userRole) return false;
    return userRole === 'admin';
  };

  return {
    userRole,
    isBuyer,
    isSeller,
    isAdmin,
    loading,
  };
};

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (currentUser) {
      const fetchUserRole = async (user) => {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        console.log(`[UserRoleProvider] Fetching user role for ${user.uid}`);

        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role || 'buyer'; // Default to 'buyer' if no role found
            console.log(`[UserRoleProvider] Found role for ${user.uid}: ${role}`);
            setUserRole(role);
          } else {
            // If user document doesn't exist, create it with 'buyer' role
            console.log(`[UserRoleProvider] No user doc found, creating for ${user.uid} with role 'buyer'`);
            await setDoc(userDocRef, { role: 'buyer' });
            setUserRole('buyer');
          }
        } catch (err) {
          console.error('[UserRoleProvider] Error fetching role:', err);
          setUserRole(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserRole(currentUser);
    } else {
      setUserRole(null);
      setLoading(false);
    }
  }, [currentUser, authLoading]);

  return (
    <UserRoleContext.Provider value={{ userRole, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
