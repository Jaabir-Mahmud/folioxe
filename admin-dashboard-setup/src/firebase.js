import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration - use environment variables for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJaEJpiiXZIlATnCNViCAHbmDagx8M1ao",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "folioxe.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "folioxe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "folioxe.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "596692680218",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:596692680218:web:45c5aeaeae8652d42f5ba3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-72TG155M4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore
// This allows the app to work offline and sync when back online
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.log('Persistence failed - multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.log('Persistence not supported by browser');
  }
});

export default app; 