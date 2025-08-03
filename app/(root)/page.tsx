import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import InterviewCard from '@/components/InterviewCard';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { getInterviewByUserId, getLatestInterviews, getFeedbackByInterviewId } from "@/lib/actions/general.action";


interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
  userId: string;
  level: string;
  questions: string[];
  finalized: boolean;
}


const safeLength = (arr: any[] | null | undefined) => arr?.length ?? 0;

interface InterviewWithFeedback extends Omit<Interview, 'createdAt'> {
  hasFeedback: boolean;
  feedback?: any; 
  createdAt?: string | Date;
}

const Page = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please sign in to view interviews</p>
      </div>
    );
  }

  
  const [userInterviews = [], latestInterviews = []] = await Promise.all([
    getInterviewByUserId(user.id) as Promise<Interview[]>,
    getLatestInterviews({ userId: user.id }) as Promise<Interview[]>
  ]);

  //fetch feedback for each interview
  const interviewsWithFeedback = await Promise.all(
    (latestInterviews || []).map(async (interview) => {
      if (!interview?.id) return null;
      
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user.id
      });
      
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
        hasFeedback: !!feedback?.finalAssessment,
        feedback
      } as InterviewWithFeedback;
    })
  ).then(interviews => interviews.filter(Boolean) as InterviewWithFeedback[]);

  const hasPastInterviews = safeLength(userInterviews) > 0;
  const hasUpcomingInterviews = safeLength(latestInterviews) > 0;

  return (
    <>
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
                <Link href="/interview">Generate Interview</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-5">
        <h2 className="text-2xl font-bold mb-6">Take an Interview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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