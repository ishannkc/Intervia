/**
 * Firebase Client SDK Initialization
 * 
 * This module initializes the Firebase Client SDK for client-side operations.
 * It provides access to Firebase services like Authentication and Firestore
 * from the client side of the application.
 * 
 * Related files:
 * - /firebase/admin.ts: Server-side Firebase Admin SDK initialization
 * - /app/(auth)/sign-in/page.tsx: Uses the auth instance for user sign-in
 * - /app/(auth)/sign-up/page.tsx: Uses the auth instance for user registration
 */

// Import required Firebase client SDK modules
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object containing API keys and project settings
 * 
 * Note: In a production environment, consider moving sensitive values
 * to environment variables for better security.
 */
const firebaseConfig = {
  // API key for Firebase services
  apiKey: "AIzaSyDOCea6ZKcg9cg0fPSjQDG26rw_GTWTKow",
  // Domain for Firebase Authentication
  authDomain: "intervia-1efd6.firebaseapp.com",
  // Firebase project ID
  projectId: "intervia-1efd6",
  // Cloud Storage bucket
  storageBucket: "intervia-1efd6.firebasestorage.app",
  // Sender ID for Firebase Cloud Messaging
  messagingSenderId: "1007688589779",
  // Firebase App ID
  appId: "1:1007688589779:web:e56e042334c7755c620f26",
  // Google Analytics measurement ID
  measurementId: "G-LG102YNMM1"
};

// Initialize Firebase app only once to prevent duplicate instances
// If an app already exists, use that instance; otherwise, initialize a new one
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and export for use in components
// This auth instance handles user sign-in, sign-up, and session management
//
// Example usage in components:
// import { auth } from '@/firebase/client';
// await signInWithEmailAndPassword(auth, email, password);
export const auth = getAuth(app);

// Initialize Cloud Firestore and export for use in components
// This db instance provides access to the Firestore database
//
// Example usage in components:
// import { db } from '@/firebase/client';
// const docRef = doc(db, 'collection', 'document');
// const docSnap = await getDoc(docRef);
export const db = getFirestore(app);
