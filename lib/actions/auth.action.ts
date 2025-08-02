// This is a server-side only module that handles authentication-related operations
'use server';

// Import Firebase Admin SDK for server-side operations
import { db, auth } from "@/firebase/admin";
// Import Next.js cookies API for managing session cookies
import { cookies } from "next/headers";

// Session duration: 1 week in seconds
const ONE_WEEK = 60 * 60 * 24 * 7;

/**
 * Creates a new user account in Firebase Authentication and Firestore
 * 
 * @param {SignUpParams} params - User registration parameters
 * @param {string} params.uid - The user's unique ID from Firebase Auth
 * @param {string} params.name - The user's full name
 * @param {string} params.email - The user's email address
 * @returns {Promise<{success: boolean, message: string}>} Registration result
 */
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user already exists in Firestore
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "Email already in Use"
      };
    }

    // Create new user document in Firestore
    await db.collection('users').doc(uid).set({
      name, 
      email,
      // Add any additional user fields here
    });

    return {
      success: true,
      message: "Account created successfully!"
    };

  } catch (e: any) {
    // Handle specific Firebase Auth errors
    if (e.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: "Email already in Use"
      };
    }
    
    // Generic error response
    return {
      success: false,
      message: "Account creation failed. Please try again."
    };
  }
}

/**
 * Authenticates a user and sets a session cookie
 * 
 * @param {SignInParams} params - User sign-in parameters
 * @param {string} params.email - The user's email address
 * @param {string} params.idToken - The Firebase ID token from client-side auth
 * @returns {Promise<{success: boolean, message?: string}>} Authentication result
 */
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Verify the user exists in Firebase Auth
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }

    // Set the session cookie for authenticated requests
    await setSessionCookie(idToken);

    return {
      success: true
    };

  } catch (e) {
    // Generic error message to avoid leaking information
    return {
      success: false,
      message: "Invalid email or password"
    };
  }
}

/**
 * Creates and sets a secure HTTP-only session cookie
 * 
 * @param {string} idToken - The Firebase ID token from client-side auth
 * @returns {Promise<void>}
 */
export async function setSessionCookie(idToken: string) {
  // Get the cookie store from Next.js
  const cookieStore = await cookies();

  // Create a Firebase session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // Convert to milliseconds
  });

  // Set the secure, HTTP-only cookie
  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK, // 1 week in seconds
    httpOnly: true,   // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    path: '/',        // Accessible across the entire site
    sameSite: 'lax'   // CSRF protection
  });
}

/**
 * Retrieves the currently authenticated user from the session cookie
 * 
 * @returns {Promise<User | null>} The authenticated user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  // Get the cookie store from Next.js
  const cookieStore = await cookies();

  // Get the session cookie value
  const sessionCookie = cookieStore.get('session')?.value;

  // No session cookie means not authenticated
  if (!sessionCookie) return null;

  try {
    // Verify the session cookie with Firebase
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Get additional user data from Firestore
    const userRecord = await db
      .collection('users')
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    // Combine auth and profile data
    return {
      ...userRecord.data(),
      id: userRecord.id,
      email: decodedClaims.email // Ensure email is always from the verified token
    } as User;

  } catch (e) {
    // Invalid or expired session
    return null;
  }
}

/**
 * Checks if the current request is from an authenticated user
 * 
 * @returns {Promise<boolean>} True if the user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  // Get the current user (if any)
  const user = await getCurrentUser();
  
  // Return true if user exists, false otherwise
  return !!user;
}
