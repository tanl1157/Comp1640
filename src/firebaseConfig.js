// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, set, get, child, update, push } from 'firebase/database';

// Your Firebase config object (có thể lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAOylmcJZdVRA8xY-QHiYLGgxZmowK4APk",  // Replace with your actual API key
  authDomain: "comp1640-7a48b.firebaseapp.com",
  projectId: "comp1640-7a48b",
  storageBucket: "comp1640-7a48b.appspot.com",
  messagingSenderId: "458632314893",
  appId: "1:458632314893:web:fc9a8cf96b76061cbb1544",
  measurementId: "G-J7GY8QMWP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);  // Changed the variable name to firestore
const storage = getStorage(app);
const realTimeDb = getDatabase(app);  // Changed the variable name to realTimeDb


// Export các dịch vụ Firebase bạn muốn sử dụng
export { auth, signOut, firestore, storage, realTimeDb, ref, set, get, child, update, push };   // Export firestore and realTimeDb instead of db
