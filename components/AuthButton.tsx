'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const isUserAuthenticated = !!user;
      setIsAuthenticated(isUserAuthenticated);
      setIsLoading(false);
      
      // If not authenticated redirect to sign-in
      if (!isUserAuthenticated && !window.location.pathname.includes('sign-in')) {
        router.push('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

 
  if (isLoading) return null;
  
  //if user is autheticated, then show log out
  return isAuthenticated ? (
    <Button 
      variant="outline" 
      className="bg-black text-white hover:bg-gray-900 hover:text-white"
      onClick={handleSignOut}
    >
      Log Out
    </Button>
  ) : null;
}
