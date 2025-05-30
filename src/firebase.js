// folioxe/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Import getFirestore
// import { getAnalytics } from "firebase/analytics"; // Optional

// Your web app's Firebase configuration (ensure this is correct)
const firebaseConfig = {
  apiKey: "AIzaSyBL06dBwZl0E6k93WrlZe0hwoKkYbA2h4U", // Your actual API key
  authDomain: "folioxe-client.firebaseapp.com",
  projectId: "folioxe-client",
  storageBucket: "folioxe-client.appspot.com", // Or .firebasestorage.app if that's what Firebase gave you
  messagingSenderId: "717885827096",
  appId: "1:717885827096:web:9ee4c61ba61f937411fb6d",
  measurementId: "G-RM6VGENVSB" // Optional
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