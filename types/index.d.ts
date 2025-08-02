/**
 * Represents feedback for an interview session
 */
interface Feedback {
  /** Unique identifier for the feedback */
  id: string;
  /** ID of the interview this feedback is for */
  interviewId: string;
  /** Overall score (0-100) for the interview */
  totalScore: number;
  /** Detailed scores for different assessment categories */
  categoryScores: Array<{
    /** Name of the category (e.g., 'Technical Knowledge') */
    name: string;
    /** Score for this category (0-100) */
    score: number;
    /** Detailed comments about performance in this category */
    comment: string;
  }>;
  /** List of strengths identified during the interview */
  strengths: string[];
  /** Areas where the candidate can improve */
  areasForImprovement: string[];
  /** Overall assessment and summary of the interview */
  finalAssessment: string;
  /** ISO timestamp when the feedback was created */
  createdAt: string;
}

/**
 * Represents an interview session
 */
interface Interview {
  /** Unique identifier for the interview */
  id: string;
  /** Job role the interview is for */
  role: string;
  /** Experience level (e.g., 'Entry', 'Mid', 'Senior') */
  level: string;
  /** List of questions asked during the interview */
  questions: string[];
  /** Technologies relevant to the interview */
  techstack: string[];
  /** ISO timestamp when the interview was created */
  createdAt: string;
  /** ID of the user who created the interview */
  userId: string;
  /** Type of interview ('technical', 'behavioral', 'mixed') */
  type: string;
  /** Whether the interview has been completed and finalized */
  finalized: boolean;
}

/**
 * Parameters for creating feedback for an interview
 */
interface CreateFeedbackParams {
  /** ID of the interview to create feedback for */
  interviewId: string;
  /** ID of the user creating the feedback */
  userId: string;
  /** Transcript of the interview with speaker roles and content */
  transcript: Array<{ 
    /** Role of the speaker ('user' or 'assistant') */
    role: string; 
    /** Text content of the message */
    content: string; 
  }>;
  /** Optional ID to update existing feedback */
  feedbackId?: string;
}

/**
 * Represents a user in the system
 */
interface User {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** Unique user ID */
  id: string;
}

/**
 * Props for the InterviewCard component
 */
interface InterviewCardProps {
  /** Unique identifier for the interview */
  id?: string;
  /** ID of the user who owns the interview */
  userId?: string;
  /** Job role the interview is for */
  role: string;
  /** Type of interview ('technical', 'behavioral', 'mixed') */
  type: string;
  /** Technologies relevant to the interview */
  techstack: string[];
  /** ISO timestamp when the interview was created */
  createdAt?: string;
}

/**
 * Props for the Agent component
 */
interface AgentProps {
  /** Name of the user */
  userName: string;
  /** ID of the current user */
  userId?: string;
  /** ID of the interview (if resuming an existing one) */
  interviewId?: string;
  /** ID of the feedback (if viewing feedback) */
  feedbackId?: string;
  /** Type of agent interaction */
  type: "generate" | "interview";
  /** List of questions (for interview mode) */
  questions?: string[];
}

/**
 * Route parameters for Next.js pages
 */
interface RouteParams {
  /** Dynamic route parameters */
  params: Promise<Record<string, string>>;
  /** URL search parameters */
  searchParams: Promise<Record<string, string>>;
}

/**
 * Parameters for retrieving feedback by interview ID
 */
interface GetFeedbackByInterviewIdParams {
  /** ID of the interview to get feedback for */
  interviewId: string;
  /** ID of the user requesting the feedback */
  userId: string;
}

/**
 * Parameters for retrieving the latest interviews
 */
interface GetLatestInterviewsParams {
  /** ID of the current user (to exclude their interviews) */
  userId: string;
  /** Maximum number of interviews to return */
  limit?: number;
}

/**
 * Parameters for user sign-in
 */
interface SignInParams {
  /** User's email address */
  email: string;
  /** Firebase ID token from client-side authentication */
  idToken: string;
}

/**
 * Parameters for user registration
 */
interface SignUpParams {
  /** Firebase Auth UID */
  uid: string;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's password (hashed client-side) */
  password: string;
}

/**
 * Type of authentication form to display
 */
type FormType = "sign-in" | "sign-up";

/**
 * Props for the InterviewForm component
 */
interface InterviewFormProps {
  /** ID of the interview (for updates) */
  interviewId: string;
  /** Job role for the interview */
  role: string;
  /** Experience level ('Entry', 'Mid', 'Senior') */
  level: string;
  /** Type of interview ('technical', 'behavioral', 'mixed') */
  type: string;
  /** List of technologies to include */
  techstack: string[];
  /** Number of questions to generate */
  amount: number;
}

/**
 * Props for the TechIcon component
 */
interface TechIconProps {
  /** List of technologies to display icons for */
  techStack: string[];
}
