import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration for folioxe project
const firebaseConfig = {
  apiKey: "AIzaSyBJaEJpiiXZIlATnCNViCAHbmDagx8M1ao",
  authDomain: "folioxe.firebaseapp.com",
  projectId: "folioxe",
  storageBucket: "folioxe.appspot.com",
  messagingSenderId: "596692680218",
  appId: "1:596692680218:web:45c5aeaeae8652d42f5ba3",
  measurementId: "G-72TG155M4L"
};

console.log('🔧 Testing Firebase connection...');
console.log('📋 Project ID:', firebaseConfig.projectId);

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
  
  const db = getFirestore(app);
  console.log('✅ Firestore initialized');
  
  // Test Firestore connection (without authentication)
  console.log('📊 Testing Firestore connection...');
  const querySnapshot = await getDocs(collection(db, 'users'));
  console.log('✅ Firestore connection successful');
  console.log('📄 Found', querySnapshot.size, 'documents in users collection');
  
  console.log('✅ Test completed successfully');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('🔍 Error code:', error.code);
  console.error('📝 Full error:', error);
} 