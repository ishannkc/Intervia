import dayjs from 'dayjs'; //for date
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import TechStackDisplay from './TechStackDisplay';

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
    level?: string;
    techstack?: string[];
    createdAt?: Date | string;
    feedback?: Feedback | null;
}

const formatLevelText = (text: string): string => {
  if (!text) return '';
  
  const formatted = text
    .toLowerCase()
    .split(/[\s-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // ends techstack with "level"
  const levelRegex = /\blevel\s*$/i;
  if (!levelRegex.test(formatted)) {
    return `${formatted} Level`;
  }
  return formatted;
};

const InterviewCard = ({ id, userId, role, type, level, techstack, createdAt, feedback }: InterviewCardProps ) => {
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedLevel = level ? formatLevelText(level) : '';
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    const hasFeedback = !!feedback?.finalAssessment;

    return (
        <div className={`card-border w-[360px] m-sm:w-full ${hasFeedback ? 'h-auto' : 'max-h-96'}`}>
            <div className="card-interview h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                    <div className="absolute top-0 left-0 right-0 flex justify-between">
                        {formattedLevel && (
                            <div className="px-4 py-2 rounded-br-lg bg-light-600">
                                <p className="badge-text">{formattedLevel}</p>
                            </div>
                        )}
                        <div className="px-4 py-2 rounded-bl-lg bg-light-600">
                            <p className="badge-text">{normalizedType}</p>
                        </div>
                    </div>
                    
                    <h3 className="mt-8 capitalize">
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
                    
                    {hasFeedback && (
                        <div className="mt-3 flex-1 overflow-hidden">
                            <p className="line-clamp-4">{feedback.finalAssessment}</p>
                        </div>
                    )}
                    {!hasFeedback && (
                        <div className="flex-1 flex items-center">
                            <p className="text-gray-500 text-center w-full">You haven't taken the interview yet!</p>
                        </div>
                    )}
                    {techstack && techstack.length > 0 && (
                        <div className="mt-2">
                            <TechStackDisplay 
                                techStack={techstack} 
                                className="" 
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-3">
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