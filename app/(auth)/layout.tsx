/**
 * Authentication Layout
 * 
 * This layout component provides a consistent wrapper for all authentication-related pages.
 * It's used by the sign-in and sign-up pages to maintain a consistent look and feel.
 * 
 * Related files:
 * - /app/(auth)/sign-in/page.tsx: Sign in page
 * - /app/(auth)/sign-up/page.tsx: Sign up page
 * - /components/AuthForm.tsx: The authentication form component
 */

import { ReactNode } from 'react';

/**
 * Authentication Layout Component
 * 
 * @param children - Child components to be rendered within the layout
 * @returns JSX element containing the authentication layout structure
 */
const AuthLayout = async({ children }: { children: ReactNode }) => {
  return (
    // Main container for authentication pages with a dedicated class for styling
    <div className="auth-layout">
      {children}
    </div>
  )
}

export default AuthLayout;