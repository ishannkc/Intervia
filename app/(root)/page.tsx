import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'

const Page = () => {
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
          <p>You haven&apos;t taken any interviews yet</p>
        </div>
  
    </section>

    <section className="flex flex-col gap-6 mt-8">
      <h2>Take an Interview</h2>
      <div className = "interviews-section">
        <p>There are no interviews available</p>
      </div>

    </section>

    </>
  )
}

export default Page
