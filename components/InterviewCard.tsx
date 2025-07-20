import dayjs from 'dayjs'; //for date
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { getFeedbackByInterviewId } from '@/lib/actions/general.action';

interface Feedback {
    id?: string;
    interviewId?: string;
    userId?: string;
    totalScore?: number;
    categoryScores?: Array<{
        name: string;
        score: number;
        comment: string;
    }>;
    strengths?: string[];
    areasForImprovement?: string[];
    finalAssessment?: string;
    createdAt?: string | Date;
}

interface InterviewCardProps {
    id: string;
    userId: string;
    role: string;
    type: string;
    techstack?: string[];
    createdAt?: Date | string;
    feedback?: Feedback | null;
}

const InterviewCard = ({ id, userId, role, type, techstack, createdAt, feedback }: InterviewCardProps ) => {
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    const hasFeedback = !!feedback?.finalAssessment;

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-80">
            <div className="card-interview">
                <div>
                    <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                        <p className="badge-text">{normalizedType}</p>
                    </div>
                    
                    <h3 className="mt-5 capitalize">
                        {role} Interview
                    </h3>

                    <div className="flex flex-row gap-5 mt-4">
                        <div className="flex flex-row gap-2">
                            <Image src="/calendar.svg" alt="calendar" width={22} height={22} /> 
                            <p>{formattedDate}</p>
                        </div>
                        {hasFeedback && (
                            <div className="flex flex-row gap-2 items-center">
                                <Image src="/star.svg" alt="star" width={22} height={22} />
                                <p>{feedback?.totalScore || 0}/100</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-5 min-h-[3rem]">
                        {hasFeedback ? (
                            <p className="line-clamp-2">{feedback.finalAssessment}</p>
                        ) : (
                            <p className="text-gray-500">You haven't taken the interview yet!</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {hasFeedback && (
                        <Button asChild className="btn-primary">
                            <Link href={`/interview/${id}/feedback`} className="w-full text-center">
                                Check Feedback
                            </Link>
                        </Button>
                    )}
                    
                    <Button asChild className="btn-primary">
                        <Link href={`/interview/${id}`} className='w-full text-center'>
                            {hasFeedback ? 'Retake Interview' : 'Take Interview'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;