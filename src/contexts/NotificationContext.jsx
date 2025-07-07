// folioxe/src/contexts/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userNotifications = userData.notifications || [];
          
          // Sort by timestamp (newest first)
          const sortedNotifications = [...userNotifications].sort(
            (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
          );
          
          setNotifications(sortedNotifications);
          setUnreadCount(sortedNotifications.filter(n => !n.read).length);
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const addNotification = async (notification) => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        notifications: arrayUnion({
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false
        })
      });
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const notification = notifications.find(n => n.id === notificationId);
      
      if (notification) {
        // Remove the old notification
        await updateDoc(userRef, {
          notifications: arrayRemove(notification)
        });
        
        // Add it back as read
        await updateDoc(userRef, {
          notifications: arrayUnion({
            ...notification,
            read: true
          })
        });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.uid || unreadCount === 0) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const updates = notifications.map(n => ({
        ...n,
        read: true
      }));
      
      await updateDoc(userRef, {
        notifications: updates
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    if (!currentUser?.uid) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        notifications: []
      });
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};