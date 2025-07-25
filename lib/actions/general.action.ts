'use server';

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { nullable } from "zod";

export async function getInterviewByUserId(userId: string): Promise<Interview[] | null>{
  const interviews = await db
      .collection('interviews')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null>{
  const { userId, limit = 20} = params;

  const interviews = await db
      .collection('interviews')
      .orderBy('createdAt', 'desc')
      .where('finalized', '==', true)
      .where('userId', '!=', userId)
      .limit(limit)
      .get();

      return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null>{

    const interviews = await db
        .collection('interviews')
        .doc(id)
        .get();
  
        return interviews.data() as Interview | null;
  }

  export async function createFeedback(params: CreateFeedbackParams){
    const { interviewId, userId, transcript} = params;

    try{
      const formattedTranscript = transcript
        .map((sentence:{ role: string; content: string; })=>(
          `- ${sentence.role}: ${sentence.content}\n`
        )) .join('');

        const {object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment}} = await generateObject({
          model: google('gemini-2.0-flash-001', {
            structuredOutputs: false,
          }),
            schema: feedbackSchema,
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

        const feedback = await db.collection('feedback').add({
          interviewId,
          userId,
          totalScore,
          categoryScores,
          strengths,
          areasForImprovement,
          finalAssessment,
          createdAt: new Date().toISOString()
        })

        return{
          success: true,
          feedbackId: feedback.id
        }

    } catch (e){
      console.error('Error Saving Feedback!', e)

      return {success: false}
    }
  }

  export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;
  
    // Fetching feedback from the database
    const feedbackSnapshot = await db
      .collection('feedback')
      .where('interviewId', '==', interviewId)
      .where('userId', '==', userId)
      .limit(1)
      .get();
  
    if (feedbackSnapshot.empty) return null;
  
    const feedbackDoc = feedbackSnapshot.docs[0];
  
    return {
      id: feedbackDoc.id,
      ...feedbackDoc.data(),
    } as Feedback;
  }
  
