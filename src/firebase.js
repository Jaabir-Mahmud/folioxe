// folioxe/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Import getFirestore
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration (ensure this is correct)
const firebaseConfig = {
  apiKey: "AIzaSyDmVDo113V1eXWePVF7UzJTeImy5cERj6c",
  authDomain: "folioxe.firebaseapp.com",
  projectId: "folioxe",
  storageBucket: "folioxe.firebasestorage.app",
  messagingSenderId: "24755386035",
  appId: "1:24755386035:web:06060aa42a521d4e9ee2c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// 2. Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// const analytics = getAnalytics(app); // Optional

// 3. Export both auth and db
export { auth, db };