/**
 * Sign Up Page
 * 
 * This page allows new users to create an account by providing their information.
 * It utilizes the AuthForm component with the 'sign-up' type to handle the registration flow.
 * 
 * Route: /sign-up
 * 
 * Related files:
 * - /components/AuthForm.tsx: The reusable authentication form component
 * - /app/(auth)/layout.tsx: The authentication layout wrapper
 * - /lib/actions/auth.action.ts: Handles the user registration logic
 */

import AuthForm from '@/components/AuthForm';

/**
 * Sign Up Page Component
 * 
 * @returns JSX element rendering the sign-up form
 */
const Page = () => {
  return (
    // Render the AuthForm component with type="sign-up"
    <AuthForm type="sign-up" />
  );
}

export default Page;