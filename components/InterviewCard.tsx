import dayjs from 'dayjs'; //for date
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';


const InterviewCard = ({ interviewId, userId, role, type, techstack, createdAt}: InterviewCardProps ) => {
    const feedback = null as Feedback | null; //feedbacks initially set to null
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type; //for non-tehncial says mix
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY')
  return (
    <div className = "card-border w-[360px] max-sm:w-full min-h-80">
        <div className = "card-interview">
            <div>
                <div className = "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                    <p className = "badge-text">{normalizedType}</p>
                </div>
                
                <h3 className="mt-5 capitalize">
                    {role} Interview
                </h3>

                <div className = "flex flex-row gap-5 mt-4">
                    <div className = "flex flex-row gap-2">
                        <Image src = "/calendar.svg" alt = "calendar" width = {22} height = {22} /> 
                        <p>{formattedDate}</p>
                    </div>
                    <div className = "flex flex-row gap-2 items-center">
                        <Image src = "/star.svg" alt = "star" width = {22} height = {22} />
                        <p>{feedback?.totalScore || '---'}/100</p>
                    </div>
                </div>
                <p className = "line-clamp-2 mt-5">
                    {feedback?.finalAssessment || "You haven't taken the interview yet!"}
                </p>
            </div>

            <div className = "flex flex-row justify-between">
        

                <Button className = "btn-primary">
                    <Link href = {feedback 
                        ? `/interview/${interviewId}/feedback`
                        : `/interview/${interviewId}`
                    }>
                        {feedback ? 'Check Feedback' : 'View Interview'}
                    </Link>
                </Button>
            </div>

        </div>
    </div>
  )
}

export default InterviewCard