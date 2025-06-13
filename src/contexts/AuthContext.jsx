// folioxe/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase.js';
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
      console.log("--- onAuthStateChanged ---");
      if (firebaseUser) {
        console.log("onAuthStateChanged: FirebaseUser Object RECVD:", firebaseUser);
        console.log("onAuthStateChanged: FirebaseUser UID:", firebaseUser.uid);
        console.log("onAuthStateChanged: FirebaseUser Email:", firebaseUser.email);
        console.log("onAuthStateChanged: FirebaseUser displayName FROM FIREBASE:", firebaseUser.displayName);
        console.log("onAuthStateChanged: FirebaseUser emailVerified:", firebaseUser.emailVerified);
        console.log("onAuthStateChanged: FirebaseUser Provider Data:", firebaseUser.providerData);

        if (firebaseUser.providerData.some(provider => provider.providerId === 'password') && !firebaseUser.emailVerified) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
          });
          setIsAuthenticated(false); 
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
          });
          setIsAuthenticated(true);
        }
      } else {
        console.log("onAuthStateChanged: No FirebaseUser (logged out).");
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
        console.log("Signup: updateProfile call finished. Current Firebase user (auth.currentUser) displayName:", auth.currentUser?.displayName);

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
      if (userCredential.user && userCredential.user.providerData.some(p => p.providerId === 'password') && !userCredential.user.emailVerified) {
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
      console.log("--- loginWithGoogle successful ---");
      console.log("loginWithGoogle: result.user object:", result.user);
      console.log("loginWithGoogle: result.user.displayName FROM GOOGLE/FIREBASE:", result.user.displayName);
      console.log("loginWithGoogle: result.user.email:", result.user.email);
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
    if (auth.currentUser && auth.currentUser.providerData.some(p => p.providerId === 'password') && !auth.currentUser.emailVerified) {
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
      throw new Error("No user is currently signed in to resend verification for, or user is not an email/password user.");
    }
  };

  const sendPasswordReset = async (email) => {
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
    sendPasswordReset
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