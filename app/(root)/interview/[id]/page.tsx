/**
 * Interview Details Page
 * 
 * This page displays the interview interface where users can conduct their interview.
 * It shows the interview details and initializes the Agent component for the interview session.
 * 
 * Route: /interview/[id]
 * 
 * Related files:
 * - /components/Agent.tsx: The main interview interface component
 * - /lib/actions/auth.action.ts: For getting current user information
 * - /lib/actions/general.action.ts: For fetching interview data
 */

// Import necessary components and utilities
import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';

/**
 * Interview Details Page Component
 * 
 * @param params - Route parameters containing the interview ID
 * @returns JSX element displaying the interview interface
 */
const Page = async({ params }: RouteParams) => {
    // Extract interview ID from route parameters
    const { id } = await params;
    
    // Get the currently authenticated user
    const user = await getCurrentUser();
    
    // Fetch interview details by ID
    const interview = await getInterviewById(id);

    // Redirect to home if interview is not found
    if (!interview) redirect('/');

    return (
        // Main container with vertical spacing
        <div className="space-y-8">
            {/* Interview header section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {/* Interview role/title */}
                        <h2 className="text-3xl font-bold capitalize">
                            {interview.role} Interview
                        </h2>
                        {/* Interview type badge */}
                        <span className="bg-dark-200 px-4 py-2 rounded-lg text-sm font-medium capitalize w-fit">
                            {interview.type}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Agent component that handles the interview interface */}
            <div className="mt-10">
                <Agent 
                    userName={user?.name || 'User'}  // Fallback to 'User' if name is not available
                    userId={user?.id}               // Current user's ID for tracking
                    interviewId={id}                // Current interview ID
                    type="interview"                // Type of agent (interview mode)
                    questions={interview.questions} // List of questions for the interview
                />
            </div>
        </div>
    )
}

export default Page