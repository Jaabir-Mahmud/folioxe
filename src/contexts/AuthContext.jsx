// folioxe/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  auth,
  db
} from '../firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isEmailPasswordUser = firebaseUser.providerData.some(
          provider => provider.providerId === 'password'
        );

        // For email/password users, require email verification
        if (isEmailPasswordUser && !firebaseUser.emailVerified) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: false,
          });
          setIsAuthenticated(false);
        } else {
          // Google or verified email user
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
          });
          setIsAuthenticated(true);

          // Create/update user doc in Firestore for Google users
          if (!isEmailPasswordUser) {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              role: 'buyer',
              createdAt: new Date().toISOString()
            }, { merge: true });
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (name, email, password, role = 'buyer') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        });
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
      }
      return {
        message: 'Signup successful! Please check your email to verify your account, then log in.'
      };
    } catch (error) {
      console.error('Firebase signup error:', error.code, error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (
        firebaseUser &&
        firebaseUser.providerData.some(p => p.providerId === 'password') &&
        !firebaseUser.emailVerified
      ) {
        await signOut(auth);
        const verificationError = new Error('Email not verified. Please check your inbox for a verification link.');
        verificationError.code = 'auth/email-not-verified';
        throw verificationError;
      }

      return firebaseUser;
    } catch (error) {
      console.error('Firebase login error:', error.code, error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Ensure user data is stored in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        role: 'buyer',
        createdAt: new Date().toISOString()
      }, { merge: true });
      return result.user;
    } catch (error) {
      console.error('Firebase Google login error:', error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error.code, error.message);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        return { message: 'Verification email resent. Please check your inbox.' };
      } catch (error) {
        console.error('Error resending verification email:', error.code, error.message);
        throw error;
      }
    } else {
      throw new Error('Your email is already verified or no user is signed in.');
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: 'Password reset email sent. Please check your inbox.' };
    } catch (error) {
      console.error('Error sending password reset email:', error.code, error.message);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resendVerificationEmail,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};