// Import React and necessary dependencies
import React from 'react';

// Import custom components and utilities
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';

/**
 * Interview Page Component
 * Main page for generating and conducting AI-powered interviews
 * 
 * This page displays the interview interface where users can start a new interview session.
 * It fetches the current user's information and renders the Agent component with the necessary props.
 */
const Page = async() => {
  // Fetch the currently authenticated user's information
  const user = await getCurrentUser();
  
  return (
    <>
      {/* Page heading */}
      <h3>Interview Generation</h3>

      {/* Render the Agent component with user details and interview type */}
      <Agent 
        userName={user?.name}  // Pass the user's name to the Agent component
        userId={user?.id}     // Pass the user's ID to the Agent component
        type="generate"       // Specify that this is for generating a new interview
      />
    </>
  )
}

// Export the Page component as the default export
export default Page;