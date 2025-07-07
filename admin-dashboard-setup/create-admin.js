import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ✅ Firebase configuration (make sure this matches your admin dashboard)
const firebaseConfig = {
  apiKey: "AIzaSyBJaEJpiiXZIlATnCNViCAHbmDagx8M1ao",
  authDomain: "folioxe.firebaseapp.com",
  projectId: "folioxe",
  storageBucket: "folioxe.appspot.com",
  messagingSenderId: "596692680218",
  appId: "1:596692680218:web:45c5aeaeae8652d42f5ba3",
  measurementId: "G-72TG155M4L"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Admin account details
const ADMIN_EMAIL = 'admin@folioxe.com';     // 👈 Fix here
const ADMIN_PASSWORD = '12345678';
const ADMIN_FIRST_NAME = 'Xabir';
const ADMIN_LAST_NAME = 'Mahmud';

async function createAdminAccount() {
  try {
    console.log('Creating admin account...');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Name: ${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`);
    
    // ✅ Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      ADMIN_EMAIL, 
      ADMIN_PASSWORD
    );

    const user = userCredential.user;
    console.log('✅ User account created successfully!');
    console.log(`User ID: ${user.uid}`);

    // ✅ Store user details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: ADMIN_EMAIL,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      role: 'admin',
      isAdmin: true,
      createdAt: new Date(),
      lastLogin: new Date(),
      status: 'active'
    });

    console.log('✅ Admin role assigned successfully!');
    console.log('\n🎉 Admin account created successfully!');
    console.log('\nLogin credentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.error('An account with this email already exists');
        break;
      case 'auth/weak-password':
        console.error('Password is too weak. Please choose a stronger password');
        break;
      case 'auth/invalid-email':
        console.error('Invalid email address');
        break;
      default:
        console.error('Failed to create admin account');
    }
  }
}

// 🚀 Run the script
createAdminAccount();
