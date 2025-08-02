// Import necessary dependencies
import {ReactNode} from 'react'      // Type for React children components
import Link from "next/link";         // Next.js component for client-side navigation
import Image from "next/image";       // Optimized image component from Next.js

// Import custom components
import AuthButton from '@/components/AuthButton';  // Authentication button component

/**
 * RootLayout component
 * Serves as the main layout wrapper for the entire application
 * 
 * @param children - Child components to be rendered within the layout
 * @returns JSX element containing the application's layout structure
 */
const RootLayout = async({children}:{children: ReactNode}) => {
  return (
    <div className="root-layout">
      {/* Navigation bar with logo and auth button */}
      <nav className="flex justify-between items-center p-4 border-b">
        {/* Logo and brand name linking to home */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png"  // Application logo
            alt="Logo"       // Alt text for accessibility
            width={38}       // Fixed width for the logo
            height={32}      // Fixed height for the logo
          />
          <h2 className="text-primary-100">Intervia</h2>  // Brand name
        </Link>
        
        {/* Authentication button container */}
        <div className="flex items-center gap-4">
          <AuthButton />  // Renders login/logout button based on auth state
        </div>
      </nav>
      
      {/* Main content area where child components will be rendered */}
      <main className="flex-1">
        {children}  // This is where page content will be injected
      </main>
    </div>
  );
}

// Export the RootLayout component as the default export
export default RootLayout