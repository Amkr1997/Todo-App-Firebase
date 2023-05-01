import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7ykWtx49nMZr69gEO_xhwO0GEGSKvvZw",
  authDomain: "todo-login-9831b.firebaseapp.com",
  projectId: "todo-login-9831b",
  storageBucket: "todo-login-9831b.appspot.com",
  messagingSenderId: "428812495028",
  appId: "1:428812495028:web:5f3e5e8d305ddd7078cfe1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
