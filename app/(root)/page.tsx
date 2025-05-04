import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

import { exampleInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser, getInterviewByUserId, getLatestInterviews } from '@/lib/actions/auth.action'

const Page = async () => {
  const user = await getCurrentUser();

      //promise allows to fetch the user and latest interviews in parallel
  const[ userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id!})
  ])

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;

  return (
    <>
    <section className="w-full min-h-screen flex items-center justify-center px-6 -mt-55">
      <div className="max-w-4xl w-full flex items-center justify-between flex-wrap rounded-2xl bg-[#0c0c14] px-10 py-12 gap-10 shadow-lg">
        
        <div className="flex flex-col gap-6 max-w-xl text-white mx-auto">
          <h2 className="text-4xl font-bold leading-snug text-center">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-lg text-gray-300 text-center">
            Practice on real interview questions & get instant feedback
          </p>
          <div className="flex justify-center">
            <Button asChild className="btn-primary bg-violet-600 hover:bg-violet-700">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <section className="flex flex-col  gap-6 -mt-55">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard { ...interview} key = {interview.id}/>
              ))) : (
                <p>You have not taken any interviews yet</p> 
              )}  
        </div>
    </section>

    <section className="flex flex-col gap-6 mt-8">
      <h2>Take an Interview</h2>
      <div className = "interviews-section">
      {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard { ...interview} key = {interview.id}/>
              ))) : (
                <p>There are no new interviews available yet</p> 
              )}      
      </div>
    </section>

    </>
  )
}

export default Page
