/**
 * API Route: /api/vapi/generate
 * 
 * This route handles the generation of interview questions based on user parameters.
 * It uses Google's Gemini AI to generate questions and stores them in Firestore.
 * 
 * Related files:
 * - /firebase/admin.ts: Used for Firestore database operations
 * - /lib/actions/auth.action.ts: Handles user authentication
 * - /lib/actions/general.action.ts: Contains related interview operations
 */

// Import AI text generation functionality from Vercel's AI SDK
import { generateText } from "ai";
// Import Google's AI model integration
import { google } from "@ai-sdk/google";
// Import Firestore database instance from Firebase Admin
import { db } from "@/firebase/admin";

/**
 * POST handler for generating interview questions
 * 
 * @param {Request} request - The incoming HTTP request containing interview parameters
 * @returns {Promise<Response>} JSON response with success status or error
 */
export async function POST(request: Request) {
  // Extract interview parameters from the request body
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // Generate interview questions using Google's Gemini AI model
    const { text: questions } = await generateText({
      // Using Google's Gemini 2.0 Flash model for text generation
      model: google("gemini-2.0-flash-001"),
      // Structured prompt for generating interview questions
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    `,
    });

    // Structure the interview data for storage
    const interview = {
      role: role,  // Job role being interviewed for
      type: type,  // Type of interview (technical/behavioral/mixed)
      level: level,  // Experience level (e.g., Entry, Mid, Senior)
      techstack: techstack.split(","),  // Convert comma-separated string to array
      questions: JSON.parse(questions),  // Parse the generated questions from string to array
      userId: userid,  // ID of the user who created the interview
      finalized: true,  // Mark the interview as ready to use
      createdAt: new Date().toISOString(),  // Timestamp of creation
    };

    // Save the interview to Firestore in the 'interviews' collection
    await db.collection("interviews").add(interview);

    // Return success response
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error generating interview:", error);
    // Return error response with 500 status code
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

/**
 * GET handler for the API endpoint
 * 
 * @returns {Response} Simple success response with a thank you message
 * 
 * Note: This is a basic health check endpoint that can be used to verify the API is running.
 * It doesn't perform any complex operations but confirms the route is accessible.
 */
export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
