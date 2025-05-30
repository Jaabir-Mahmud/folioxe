// folioxe/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth
// import { getAnalytics } from "firebase/analytics"; // Optional: keep if you want analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL06dBwZl0E6k93WrlZe0hwoKkYbA2h4U", // This is your key
  authDomain: "folioxe-client.firebaseapp.com",
  projectId: "folioxe-client",
  storageBucket: "folioxe-client.appspot.com", // Corrected: .appspot.com for storageBucket
  messagingSenderId: "717885827096",
  appId: "1:717885827096:web:9ee4c61ba61f937411fb6d",
  measurementId: "G-RM6VGENVSB" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Initialize auth

// const analytics = getAnalytics(app); // Optional

// Export the auth instance
export { auth };