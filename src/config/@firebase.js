import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyD6h0rfuUsBltgmnH4jbNs3GHmbuB8MmbY",
  authDomain: "foodorderingapp-b360f.firebaseapp.com",
  projectId: "foodorderingapp-b360f",
  storageBucket: "foodorderingapp-b360f.appspot.com",
  messagingSenderId: "662608382412",
  appId: "1:662608382412:web:859cd0d1618089c8d8f569",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBrr-cfPJfun9szNvHp8K_6Z5VXcoUhLTM",

//   authDomain: "testproject-d0c87.firebaseapp.com",

//   projectId: "testproject-d0c87",

//   storageBucket: "testproject-d0c87.appspot.com",

//   messagingSenderId: "458782455435",

//   appId: "1:458782455435:web:d7afc70d97d33ce76f468e",

//   measurementId: "G-49QYF1B6D7",
// };

// Initializing Firebase
const app = initializeApp(firebaseConfig);
// Initializing Authentication, Firestore and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
