'use client';  // Mark as a Client Component in Next.js

// Import Next.js navigation hooks
import { usePathname, useRouter } from 'next/navigation';

// Import Firebase authentication functions
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';

// Import UI components and React hooks
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

/**
 * AuthButton Component
 * 
 * A component that handles authentication state and displays appropriate UI.
 * - Shows a Log Out button when user is authenticated on the homepage
 * - Automatically redirects unauthenticated users to the sign-in page
 * - Handles the sign-out process
 */
export default function AuthButton() {
  // Initialize hooks
  const router = useRouter();      // For programmatic navigation
  const pathname = usePathname();  // Get current route path
  
  // Component state
  const [isLoading, setIsLoading] = useState(true);           // Loading state while checking auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Authentication state

  // Effect to handle authentication state changes
  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Update authentication state based on user presence
      const isUserAuthenticated = !!user;
      setIsAuthenticated(isUserAuthenticated);
      setIsLoading(false);  // Loading complete
      
      // Redirect unauthenticated users to the sign-in page
      // (unless already on the sign-in page to prevent loops)
      if (!isUserAuthenticated && !window.location.pathname.includes('sign-in')) {
        router.push('/sign-in');
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [router]);  // Re-run if router changes

  /**
   * Handles the sign-out process
   * - Signs out the user using Firebase auth
   * - Redirects to the sign-in page on success
   * - Logs any errors that occur during sign out
   */
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      // Redirect to sign-in page after successful sign out
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      // In a production app, you might want to show a toast notification here
    }
  };

 
  // Don't render anything while checking authentication status
  if (isLoading) return null;
  
  // Only render the Log Out button if:
  // 1. User is authenticated, AND
  // 2. Current page is the homepage ('/')
  return isAuthenticated && pathname === '/' ? (
    <Button 
      variant="outline" 
      className="bg-black text-white hover:bg-gray-900 hover:text-white"
      onClick={handleSignOut}
      aria-label="Sign out"
    >
      Log Out
    </Button>
  ) : null;  // Render nothing if conditions aren't met
}
