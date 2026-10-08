
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

const MAX_QUESTIONS = 30;

interface GenerateArguments {
  role?: string;
  type?: string;
  level?: string;
  techstack?: string | string[];
  amount?: string | number;
  userid?: string;
}

interface ToolCallShape {
  id?: string;
  arguments?: unknown;
  function?: { arguments?: unknown };
}

const extractToolCall = (body: any): ToolCallShape | undefined => {
  const toolCallList = body?.message?.toolCallList;
  const firstFromList = Array.isArray(toolCallList)
    ? toolCallList[0]
    : toolCallList?.toolCalls?.[0];

  return firstFromList ?? body?.toolCall ?? body?.toolCalls?.[0];
};

const parseArguments = (toolCall: ToolCallShape | undefined, body: any): GenerateArguments => {
  let args: unknown =
    toolCall?.arguments ?? toolCall?.function?.arguments ?? body;

  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      args = {};
    }
  }

  return (args ?? {}) as GenerateArguments;
};

const parseQuestions = (raw: string): string[] => {
  const cleaned = raw.trim();

  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : cleaned).trim();

  const attempts: string[] = [candidate];

  const arrayMatch = candidate.match(/\[[\s\S]*\]/);
  if (arrayMatch) attempts.push(arrayMatch[0]);

  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      const questions = Array.isArray(parsed)
        ? parsed
        : parsed?.questions;

      if (Array.isArray(questions) && questions.length > 0) {
        return questions.map((q) => String(q).trim()).filter(Boolean);
      }
    } catch {
      // Try the next extraction strategy
    }
  }

  const quoted = (candidate.match(/"([^"]+)"/g) ?? []).map((q) => q.slice(1, -1));
  if (quoted.length > 0) return quoted;

  throw new Error("Model did not return a valid questions array");
};

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const toolCall = extractToolCall(body);
  const { role, type, level, techstack, amount, userid } = parseArguments(toolCall, body);
  const toolCallId = toolCall?.id;

  const reply = (result: string, status = 200) =>
    Response.json(
      { result, results: [{ toolCallId, result }] },
      { status }
    );

  if (!role || !type || !level || !techstack || !amount) {
    return reply(
      "Error: interview details are missing. Ask the candidate for the missing details and call the tool again."
    );
  }

  const requestedAmount = parseInt(String(amount), 10);
  const questionCount = Number.isFinite(requestedAmount)
    ? Math.min(Math.max(requestedAmount, 1), MAX_QUESTIONS)
    : 5;

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    return reply(
      "Error: the server is missing its Google API configuration. Tell the candidate the interview could not be created and ask if they would like to try again."
    );
  }

  try {
    const { text: questionsText } = await generateText({
      model: google("gemini-3.5-flash-lite"),
      prompt: `Prepare ${questionCount} questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
    `,
    });

    const questions = parseQuestions(questionsText);

    const interview = {
      role: String(role),
      type: String(type),
      level: String(level),
      techstack: Array.isArray(techstack)
        ? techstack.map((t) => String(t).trim()).filter(Boolean)
        : String(techstack).split(",").map((t) => t.trim()).filter(Boolean),
      questions,
      userId: userid ? String(userid) : "",
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return reply(
      "Success: the interview questions were generated and saved. The candidate can start the interview from their dashboard."
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating interview:", message);
    return reply(
      "Error: the interview could not be generated. Tell the candidate it failed and ask if they would like to try again."
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
