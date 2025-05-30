// folioxe/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase.js'; // Ensure this is correct
import { /*...,*/ updateProfile, sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail // Ensure this is imported
} from "firebase/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("--- onAuthStateChanged ---"); // Marker
      if (firebaseUser) {
        console.log("FirebaseUser object from onAuthStateChanged:", firebaseUser);
        console.log("FirebaseUser UID:", firebaseUser.uid);
        console.log("FirebaseUser Email:", firebaseUser.email);
        console.log("FirebaseUser displayName:", firebaseUser.displayName); // CRUCIAL LOG
        console.log("FirebaseUser emailVerified:", firebaseUser.emailVerified);

        // ... (your existing logic to set user and isAuthenticated based on firebaseUser) ...
        if (firebaseUser.providerData.some(provider => provider.providerId === 'password') && !firebaseUser.emailVerified) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName, emailVerified: firebaseUser.emailVerified });
          setIsAuthenticated(false);
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName, emailVerified: firebaseUser.emailVerified });
          setIsAuthenticated(true);
        }
      } else {
        console.log("No FirebaseUser from onAuthStateChanged (logged out).");
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

    const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        console.log("Signup: User created. UID:", userCredential.user.uid);
        console.log("Signup: Attempting to update profile. DisplayName to set:", name);
        await updateProfile(userCredential.user, { displayName: name });
        console.log("Signup: updateProfile call finished. Current Firebase user displayName:", auth.currentUser?.displayName); // Check immediately

        await sendEmailVerification(userCredential.user);
        console.log('Signup: Verification email sent.');
        await signOut(auth);
        console.log('Signup: User signed out to enforce verification.');
      }
      return { message: "Signup successful. Please check your email to verify your account and then log in." };
    } catch (error) {
      console.error("Firebase signup error:", error.code, error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user && !userCredential.user.emailVerified) {
        await signOut(auth);
        const verificationError = new Error('Email not verified. Please check your inbox for a verification link.');
        verificationError.code = 'auth/email-not-verified';
        throw verificationError;
      }
      return userCredential.user;
    } catch (error) {
      console.error("Firebase login error:", error.code, error.message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Firebase Google login error:", error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error.code, error.message);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      try {
        await sendEmailVerification(auth.currentUser);
        return { message: "Verification email resent. Please check your inbox." };
      } catch (error) {
        console.error("Error resending verification email:", error.code, error.message);
        throw error;
      }
    } else if (auth.currentUser && auth.currentUser.emailVerified) {
      throw new Error("Your email is already verified.");
    } else {
      throw new Error("No user is currently signed in to resend verification for, or user is not from email/password provider.");
    }
  };

  const sendPasswordReset = async (email) => { // Added this function
    try {
      await sendPasswordResetEmail(auth, email);
      return { message: "Password reset email sent. Please check your inbox." };
    } catch (error) {
      console.error("Error sending password reset email:", error.code, error.message);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    resendVerificationEmail,
    sendPasswordReset // Expose sendPasswordReset
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">Loading Application...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};