/**
 * Feedback Page Component
 * 
 * This page displays detailed feedback for a completed interview.
 * It shows the overall score, category breakdown, strengths, and areas for improvement.
 * 
 * Route: /interview/[id]/feedback
 * 
 * Related files:
 * - /lib/actions/auth.action.ts: For getting current user information
 * - /lib/actions/general.action.ts: For fetching interview and feedback data
 * - /components/ui/button.tsx: For the home button component
 */

// Import necessary dependencies
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actions/general.action";
import Image from "next/image";
import { redirect } from "next/navigation";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Feedback Page Component
 * 
 * @param params - Route parameters containing the interview ID
 * @returns JSX element displaying the interview feedback
 */
const Page = async ({ params }: RouteParams) => {
  // Extract interview ID from route parameters
  const { id } = await params;
  
  // Get the currently authenticated user
  const user = await getCurrentUser();

  // Fetch interview details by ID
  const interview = await getInterviewById(id);
  
  // Redirect to home if interview is not found
  if (!interview) redirect('/');

  // Fetch feedback data for the interview
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,  // Non-null assertion as we expect a logged-in user
  });

  // Log feedback for debugging (remove in production)
  console.log(feedback);
  return (
    // Main feedback section with responsive padding
    <section className="section-feedback">
      {/* Page header with interview role */}
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{' '}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>
      {/* Score and date information */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          {/* Display final score */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Final Score:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Display feedback creation date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
      <hr className="my-4" />

      {/* Final assessment section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Overall Assessment</h2>
        <p className="text-gray-700">{feedback?.finalAssessment}</p>
      </div>

      {/* Category breakdown section */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-xl font-semibold">Breakdown of the Interview</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <p className="font-bold text-lg">
              {index + 1}. {category.name}
              <span className="ml-2 text-primary-200">
                ({category.score}/100)
              </span>
            </p>
            <p className="mt-2 text-gray-700">{category.comment}</p>
          </div>
        ))}
      </div>

      {/* Strengths section */}
      <div className="flex flex-col gap-3 mb-6">
        <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
        <ul className="list-disc pl-5 space-y-2">
          {feedback?.strengths?.map((strength, index) => (
            <li key={index} className="text-gray-700">
              {strength}
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for improvement section */}
      <div className="flex flex-col gap-3 mb-8">
        <h3 className="text-lg font-semibold text-amber-600">
          Areas for Improvement
        </h3>
        <ul className="list-disc pl-5 space-y-2">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index} className="text-gray-700">
              {area}
            </li>
          ))}
        </ul>
      </div>

      {/* Navigation button */}
      <div className="flex justify-center">
        <Button className="btn-secondary w-full max-w-xs">
          <Link href="/" className="flex w-full justify-center">
            <span className="text-sm font-semibold text-primary-200">
              Return to Home
            </span>
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default Page