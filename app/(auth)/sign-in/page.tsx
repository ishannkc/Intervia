/**
 * Sign In Page
 * 
 * This page allows users to sign in to their account using email and password.
 * It utilizes the AuthForm component with the 'sign-in' type to handle the authentication flow.
 * 
 * Route: /sign-in
 * 
 * Related files:
 * - /components/AuthForm.tsx: The reusable authentication form component
 * - /app/(auth)/layout.tsx: The authentication layout wrapper
 * - /lib/actions/auth.action.ts: Handles the authentication logic
 */

import AuthForm from '@/components/AuthForm';

/**
 * Sign In Page Component
 * 
 * @returns JSX element rendering the sign-in form
 */
const Page = () => {
  return (
    // Render the AuthForm component with type="sign-in"
    <AuthForm type="sign-in" />
  );
}

export default Page;