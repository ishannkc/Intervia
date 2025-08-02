// Import React and Next.js components
import React from 'react';
import Link from 'next/link';

// Import UI components
import { Button } from "@/components/ui/button";
import InterviewCard from '@/components/InterviewCard';

// Import action functions for data fetching
import { getCurrentUser } from '@/lib/actions/auth.action';
import { 
  getInterviewByUserId, 
  getLatestInterviews, 
  getFeedbackByInterviewId 
} from "@/lib/actions/general.action";


/**
 * Interface defining the structure of an Interview object
 */
interface Interview {
  id: string;             // Unique identifier for the interview
  role: string;           // Job role being interviewed for
  type: string;           // Type of interview (e.g., technical, behavioral)
  techstack: string[];    // Technologies involved in the interview
  createdAt: string;      // When the interview was created
  userId: string;         // ID of the user who owns the interview
  level: string;          // Experience level for the interview (e.g., Junior, Senior)
  questions: string[];    // List of questions in the interview
  finalized: boolean;     // Whether the interview has been completed
}

/**
 * Helper function to safely get array length, handling null/undefined
 * @param arr - Array to get length of
 * @returns Length of array or 0 if null/undefined
 */
const safeLength = (arr: any[] | null | undefined): number => arr?.length ?? 0;

/**
 * Extended interface for interviews that include feedback information
 */
interface InterviewWithFeedback extends Omit<Interview, 'createdAt'> {
  hasFeedback: boolean;    // Whether feedback is available
  feedback?: any;          // Feedback data (if available)
  createdAt?: string | Date; // Optional date field that can be either string or Date
}

/**
 * Main Page Component
 * Displays the dashboard with interview options and history
 */
const Page = async () => {
  // Get the currently authenticated user
  const user = await getCurrentUser();
  
  // If no user is logged in, show sign-in prompt
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to view interviews</p>
      </div>
    );
  }

  // Fetch user's interviews and latest interviews in parallel
  const [userInterviews = [], latestInterviews = []] = await Promise.all([
    getInterviewByUserId(user.id) as Promise<Interview[]>,
    getLatestInterviews({ userId: user.id }) as Promise<Interview[]>
  ]);

  // Enhance each interview with its feedback data
  const interviewsWithFeedback = await Promise.all(
    (latestInterviews || []).map(async (interview) => {
      if (!interview?.id) return null;
      
      // Fetch feedback for the current interview
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id
      });
      
      // Return interview data with feedback information
      return {
        id: interview.id,
        role: interview.role,
        type: interview.type,
        techstack: interview.techstack || [],
        createdAt: interview.createdAt,
        userId: interview.userId,
        level: interview.level,
        questions: interview.questions || [],
        finalized: interview.finalized || false,
        hasFeedback: !!feedback?.finalAssessment, // Check if feedback exists
        feedback
      } as InterviewWithFeedback;
    })
  ).then(interviews => interviews.filter(Boolean) as InterviewWithFeedback[]);

  // Check if there are any past or upcoming interviews
  const hasPastInterviews = safeLength(userInterviews) > 0;
  const hasUpcomingInterviews = safeLength(latestInterviews) > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="w-full flex items-center justify-center px-6 -mt-3">
        <div className="max-w-4xl w-full flex items-center justify-between flex-wrap rounded-2xl bg-[#0c0c14] px-10 py-12 gap-10 shadow-lg">
          <div className="flex flex-col gap-6 max-w-xl text-white mx-auto">
            <h2 className="text-4xl font-bold leading-snug text-center">
              Get Interview Ready with AI & Receive Feedback
            </h2>
            <p className="text-lg text-gray-300 text-center">
              Practice on real interview questions & get instant feedback
            </p>
            <div className="flex justify-center">
              <Button asChild className="btn-primary bg-violet-600 hover:bg-violet-700">
                <Link href="/interview">
                  Generate Interview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interview List Section */}
      <section className="container mx-auto px-4 mt-5">
        <h2 className="text-2xl font-bold mb-6">Take an Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Render interview cards if available, otherwise show message */}
          {hasUpcomingInterviews ? (
            interviewsWithFeedback.map((interview) => (
              <InterviewCard 
                key={interview.id} 
                {...interview} 
                userId={user.id}
                feedback={interview.feedback}
              />
            ))
          ) : (
            <p className="text-gray-500">There are no interviews available.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
