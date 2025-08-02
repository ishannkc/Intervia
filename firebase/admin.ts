/**
 * Firebase Admin SDK Initialization
 * 
 * This module initializes the Firebase Admin SDK for server-side operations.
 * It provides authenticated access to Firebase services like Firestore and Auth.
 * 
 * Related files:
 * - /firebase/client.ts: Client-side Firebase initialization
 * - /lib/actions/auth.action.ts: Uses these admin services for authentication
 * - /app/api/vapi/generate/route.ts: Uses the Firestore instance for database operations
 */

// Import required Firebase Admin SDK modules
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore'; 
import { getAuth } from 'firebase-admin/auth';

/**
 * Initializes and configures the Firebase Admin SDK
 * 
 * @returns {Object} An object containing initialized auth and firestore instances
 * 
 * This function ensures Firebase Admin is only initialized once and returns
 * the auth and firestore instances for use throughout the application.
 */
const initFirebaseAdmin = () => {
    // Get all initialized Firebase apps to prevent duplicate initialization
    const apps = getApps();

    // Initialize Firebase Admin SDK if it hasn't been initialized yet
    if (!apps.length) {
        initializeApp({
            // Configure Firebase Admin with service account credentials from environment variables
            credential: cert({
                // Firebase project ID from environment variables
                projectId: process.env.FIREBASE_PROJECT_ID,
                // Service account client email
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Service account private key with newline characters properly formatted
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            })
        });
    }

    // Return the initialized auth and firestore instances
    return {
        // Firebase Auth instance for user management
        auth: getAuth(),
        // Firestore instance for database operations
        db: getFirestore()
    };
}

// Initialize Firebase Admin and export the auth and firestore instances
// These can be imported and used throughout the application
// for server-side Firebase operations
//
// Example usage:
// import { auth, db } from '@/firebase/admin';
// await auth.getUser(uid);
// await db.collection('users').doc(uid).get();
export const { auth, db } = initFirebaseAdmin();