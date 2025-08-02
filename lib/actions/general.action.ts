// Server-side code that runs on the server only
'use server';

// Import schema for feedback validation
import { feedbackSchema } from "@/constants";
// Import Firebase Admin SDK for database operations
import { db } from "@/firebase/admin";
// Import AI utilities for generating feedback
import { generateObject } from "ai";
// Import Google's AI SDK for the Gemini model
import { google } from "@ai-sdk/google";


/**
 * Retrieves all interviews for a specific user
 * 
 * @param {string} userId - The ID of the user whose interviews to fetch
 * @returns {Promise<Interview[] | null>} An array of interview objects or null if none found
 */
export async function getInterviewByUserId(userId: string): Promise<Interview[] | null> {
  try {
    // Query Firestore for interviews matching the user ID, ordered by creation date (newest first)
    const interviews = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    // Map Firestore documents to Interview objects with proper typing
    return interviews.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data() // Spread the rest of the document data
    })) as Interview[];
  } catch (error) {
    console.error('Error fetching interviews by user ID:', error);
    return null;
  }
}

/**
 * Retrieves the most recent interviews from all users (excluding the current user)
 * 
 * @param {GetLatestInterviewsParams} params - Parameters for the query
 * @param {string} params.userId - The ID of the current user (to exclude their interviews)
 * @param {number} [params.limit=20] - Maximum number of interviews to return
 * @returns {Promise<Interview[] | null>} An array of interview objects or null if none found
 */
export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  try {
    // Query Firestore for the most recent finalized interviews from other users
    const interviews = await db
      .collection('interviews')
      .orderBy('createdAt', 'desc') // Newest first
      .where('finalized', '==', true) // Only include completed interviews
      .where('userId', '!=', userId) // Exclude current user's interviews
      .limit(limit) // Limit the number of results
      .get();

    // Map Firestore documents to Interview objects
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Interview[];
  } catch (error) {
    console.error('Error fetching latest interviews:', error);
    return null;
  }
}

/**
 * Retrieves a single interview by its ID
 * 
 * @param {string} id - The unique identifier of the interview to fetch
 * @returns {Promise<Interview | null>} The interview object or null if not found
 */
export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    // Fetch a single interview document by ID
    const interviewDoc = await db
      .collection('interviews')
      .doc(id)
      .get();

    // Return the interview data with proper typing
    return interviewDoc.exists ? (interviewDoc.data() as Interview) : null;
  } catch (error) {
    console.error(`Error fetching interview with ID ${id}:`, error);
    return null;
  }
}

  /**
 * Generates and saves feedback for an interview using AI analysis
 * 
 * @param {CreateFeedbackParams} params - Parameters for feedback generation
 * @param {string} params.interviewId - The ID of the interview to generate feedback for
 * @param {string} params.userId - The ID of the user who conducted the interview
 * @param {Array<{role: string, content: string}>} params.transcript - The interview transcript
 * @returns {Promise<{success: boolean, feedbackId?: string}>} The result of the operation
 */
export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    // Format the transcript for the AI prompt
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) => (
        `- ${sentence.role}: ${sentence.content}\n`
      )).join('');

    // Generate structured feedback using Google's Gemini AI
    const { object: feedback } = await generateObject({
      // Use Google's Gemini 2.0 Flash model
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      // Enforce the feedback schema for structured output
      schema: feedbackSchema,
      // Provide context and instructions to the AI
      prompt: `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
      Also, once the asked question is answered properly do not keep on revolving around the same question.
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
      - **Communication Skills**: Clarity, articulation, structured responses.
      - **Technical Knowledge**: Understanding of key concepts for the role.
      - **Problem-Solving**: Ability to analyze problems and propose solutions.
      - **Cultural & Role Fit**: Alignment with company values and job role.
      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Also keep in context that if the user skips a question, then deduct the points to be rated accordingly of how many questions there are. If the user skips all the questions then, rating is automatically zero, if it skips a few then rate accordingly. The highest possible rating is 100 and the lowest is 0.",
    });

    // Save the generated feedback to Firestore
    const feedbackDoc = await db.collection('feedback').add({
      interviewId,
      userId,
      totalScore: feedback.totalScore,
      categoryScores: feedback.categoryScores,
      strengths: feedback.strengths,
      areasForImprovement: feedback.areasForImprovement,
      finalAssessment: feedback.finalAssessment,
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      feedbackId: feedbackDoc.id
    };

  } catch (error) {
    console.error('Error generating or saving feedback:', error);
    return { success: false };
  }
}

  /**
 * Retrieves feedback for a specific interview
 * 
 * @param {GetFeedbackByInterviewIdParams} params - Parameters for the query
 * @param {string} params.interviewId - The ID of the interview to get feedback for
 * @param {string} params.userId - The ID of the user who owns the feedback
 * @returns {Promise<Feedback | null>} The feedback object or null if not found
 */
export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    // Query Firestore for feedback matching the interview and user IDs
    const feedbackSnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    // Return null if no feedback found
    if (feedbackSnapshot.empty) return null;

    // Get the most recent feedback (first in the results due to descending sort)
    const feedbackDoc = feedbackSnapshot.docs[0];
    const feedbackData = feedbackDoc.data();

    // Format the response with proper typing and date handling
    return {
      id: feedbackDoc.id,
      ...feedbackData,
      // Convert Firestore Timestamp to ISO string if needed
      createdAt: feedbackData.createdAt?.toDate 
        ? feedbackData.createdAt.toDate().toISOString() 
        : feedbackData.createdAt
    } as Feedback;
  } catch (error) {
    console.error('Error fetching feedback by interview ID:', error);
    return null;
  }
}
  
