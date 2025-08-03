import {initializeApp, getApp, getApps} from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOCea6ZKcg9cg0fPSjQDG26rw_GTWTKow",
  authDomain: "intervia-1efd6.firebaseapp.com",
  projectId: "intervia-1efd6",
  storageBucket: "intervia-1efd6.firebasestorage.app",
  messagingSenderId: "1007688589779",
  appId: "1:1007688589779:web:e56e042334c7755c620f26",
  measurementId: "G-LG102YNMM1"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth  = getAuth(app);
export const db = getFirestore(app);