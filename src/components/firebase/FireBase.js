import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0-JnKNJYP9xgtzSu6FELS2drcp8dl9Hk",
  authDomain: "souqplus-e04e6.firebaseapp.com",
  projectId: "souqplus-e04e6",
  storageBucket: "souqplus-e04e6.appspot.com",
  messagingSenderId: "115943693886",
  appId: "1:115943693886:web:cbb48ca3243dd88907bb6f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);

export { app, db };
