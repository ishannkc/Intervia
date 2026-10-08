import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

const serverUrl = process.env.NEXT_PUBLIC_VAPI_SERVER_URL ?? "https://intervia-xi.vercel.app";

export const generatorAssistant: CreateAssistantDTO = {
  name: "Intervia Generator",
  firstMessage:
    "Hello! I'll be asking you a few questions and generate a proper interview for you! Let's get started",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "ryan",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are Intervia, a friendly voice assistant that builds a personalized mock interview for the candidate.

Collect these five details, one at a time:
- role: the job role the candidate is interviewing for
- type: technical, behavioral or mixed
- level: the job experience level, for example entry, mid or senior
- techstack: the technologies to cover, as a comma separated list
- amount: how many questions the candidate wants

Rules:
- Ask one short question at a time and keep the conversation natural.
- Only use the answers the candidate gave you. Never invent values.
- If an answer is unclear, ask the same question again.
- The candidate's user id is {{userid}}. Pass it unchanged as the userid argument.
- As soon as you have all five details, call the generate_interview tool once and wait for its result. Never read the tool name or its arguments out loud.
- If the result confirms the interview was generated, tell the candidate the interview is ready on their dashboard, wish them good luck, then use the end-call tool to hang up.
- If the result reports a failure, tell the candidate the interview could not be created and offer to try again.`,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "generate_interview",
          description:
            "Creates the mock interview from the collected details and saves it to the candidate's dashboard.",
          parameters: {
            type: "object",
            properties: {
              role: {
                type: "string",
                description: "The job role the candidate is interviewing for",
              },
              type: {
                type: "string",
                description: "Interview type: technical, behavioral or mixed",
              },
              level: {
                type: "string",
                description: "The job experience level",
              },
              techstack: {
                type: "string",
                description: "Comma separated list of technologies to cover",
              },
              amount: {
                type: "string",
                description: "Number of questions the candidate asked for",
              },
              userid: {
                type: "string",
                description:
                  "The candidate user id, exactly as given in the system prompt",
              },
            },
            required: ["role", "type", "level", "techstack", "amount", "userid"],
          },
        },
        server: {
          url: `${serverUrl}/api/vapi/generate`,
          timeoutSeconds: 60,
        },
        messages: [
          {
            type: "request-start",
            content: "One moment while I generate your interview.",
          },
        ],
      },
      {
        type: "endCall",
      },
    ],
  },
} as CreateAssistantDTO;

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Are you ready for the interview?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "ryan",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
Be professional, yet warm and welcoming:

Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
- If there is a pause for more than 5 seconds then end the call automatically.`,
      },
    ],
  },

};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});
