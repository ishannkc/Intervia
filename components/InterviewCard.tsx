// Import date manipulation library
import dayjs from 'dayjs';

// Import Next.js components
import Image from 'next/image';
import Link from 'next/link';

// Import custom components
import { Button } from './ui/button';
import TechStackDisplay from './TechStackDisplay';

/**
 * Interface defining the structure of feedback data
 */
interface Feedback {
    id?: string;  // Unique identifier for the feedback
    interviewId?: string;  // Reference to the associated interview
    userId?: string;  // Reference to the user who received the feedback
    totalScore?: number;  // Overall score out of 100
    
    // Array of scores for different assessment categories
    categoryScores?: Array<{
        name: string;  // Name of the category (e.g., 'Technical Skills')
        score: number;  // Score for this category
        comment: string;  // Detailed feedback for this category
    }>;
    
    strengths?: string[];  // List of strengths identified
    areasForImprovement?: string[];  // List of areas needing improvement
    finalAssessment?: string;  // Overall assessment/feedback
    createdAt?: string | Date;  // When the feedback was created
}

/**
 * Props interface for the InterviewCard component
 */
interface InterviewCardProps {
    id: string;  // Unique identifier for the interview
    userId: string;  // ID of the user who owns the interview
    role: string;  // Job role for the interview (e.g., 'Frontend Developer')
    type: string;  // Type of interview (e.g., 'technical', 'behavioral', 'mixed')
    level?: string;  // Experience level (e.g., 'junior', 'senior')
    techstack?: string[];  // Array of technologies involved
    createdAt?: Date | string;  // When the interview was created
    feedback?: Feedback | null;  // Feedback data if available
}

/**
 * Formats the level text to ensure consistent capitalization and adds 'Level' suffix if missing
 * @param {string} text - The input level text to format
 * @returns {string} Formatted level text (e.g., 'Mid Level', 'Senior Level')
 */
const formatLevelText = (text: string): string => {
  // Return empty string for falsy input
  if (!text) return '';
  
  // Convert to title case (capitalize first letter of each word)
  const formatted = text
    .toLowerCase()
    .split(/[\s-]+/)  // Split on spaces or hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  // Check if the text already ends with 'level' (case insensitive)
  const levelRegex = /\blevel\s*$/i;
  if (!levelRegex.test(formatted)) {
    return `${formatted} Level`;  // Add 'Level' suffix if not present
  }
  return formatted;
};

/**
 * InterviewCard Component
 * Displays a card with interview details and actions
 */
const InterviewCard = ({ 
    id, 
    userId, 
    role, 
    type, 
    level, 
    techstack, 
    createdAt, 
    feedback 
}: InterviewCardProps ) => {
    // Normalize the interview type for consistent display
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    
    // Format the experience level with proper capitalization
    const formattedLevel = level ? formatLevelText(level) : '';
    
    // Format the date using dayjs (prefer feedback creation date, fall back to interview creation date)
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    
    // Check if feedback is available
    const hasFeedback = !!feedback?.finalAssessment;

    return (
        // Card container with conditional height based on feedback presence
        <div className={`card-border w-[360px] m-sm:w-full ${hasFeedback ? 'h-auto' : 'max-h-96'}`}>
            {/* Main card content */}
            <div className="card-interview h-full flex flex-col">
                {/* Card body */}
                <div className="flex-1 flex flex-col">
                    {/* Badges at the top of the card */}
                    <div className="absolute top-0 left-0 right-0 flex justify-between">
                        {/* Level badge (e.g., 'Junior Level') */}
                        {formattedLevel && (
                            <div className="px-4 py-2 rounded-br-lg bg-light-600">
                                <p className="badge-text">{formattedLevel}</p>
                            </div>
                        )}
                        {/* Interview type badge (e.g., 'Technical', 'Behavioral') */}
                        <div className="px-4 py-2 rounded-bl-lg bg-light-600">
                            <p className="badge-text">{normalizedType}</p>
                        </div>
                    </div>
                    
                    {/* Interview title */}
                    <h3 className="mt-8 capitalize">
                        {role} Interview
                    </h3>

                    {/* Metadata row with date and score */}
                    <div className="flex flex-row gap-5 mt-4">
                        {/* Interview date */}
                        <div className="flex flex-row gap-2">
                            <Image 
                                src="/calendar.svg" 
                                alt="calendar" 
                                width={22} 
                                height={22} 
                            />
                            <p>{formattedDate}</p>
                        </div>
                        {/* Score display (only shown if feedback exists) */}
                        {hasFeedback && (
                            <div className="flex flex-row gap-2 items-center">
                                <Image 
                                    src="/star.svg" 
                                    alt="star" 
                                    width={22} 
                                    height={22} 
                                />
                                <p>{feedback?.totalScore || 0}/100</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Feedback preview (shows first few lines of final assessment) */}
                    {hasFeedback && (
                        <div className="mt-3 flex-1 overflow-hidden">
                            <p className="line-clamp-4">{feedback.finalAssessment}</p>
                        </div>
                    )}
                    
                    {/* Placeholder when no feedback exists */}
                    {!hasFeedback && (
                        <div className="flex-1 flex items-center">
                            <p className="text-gray-500 text-center w-full">
                                You haven't taken the interview yet!
                            </p>
                        </div>
                    )}
                    
                    {/* Technology stack display */}
                    {techstack && techstack.length > 0 && (
                        <div className="mt-2">
                            <TechStackDisplay 
                                techStack={techstack} 
                                className="" 
                            />
                        </div>
                    )}
                </div>

                {/* Action buttons at the bottom of the card */}
                <div className="flex flex-col gap-2 mt-3">
                    {/* Show 'Check Feedback' button if feedback exists */}
                    {hasFeedback && (
                        <Button asChild className="btn-primary">
                            <Link 
                                href={`/interview/${id}/feedback`} 
                                className="w-full text-center"
                            >
                                Check Feedback
                            </Link>
                        </Button>
                    )}
                    
                    {/* Main action button - changes text based on feedback existence */}
                    <Button asChild className="btn-primary">
                        <Link 
                            href={`/interview/${id}`} 
                            className='w-full text-center'
                        >
                            {hasFeedback ? 'Retake Interview' : 'Take Interview'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;