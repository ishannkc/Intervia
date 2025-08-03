import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const generator: CreateWorkflowDTO = 
{
  "name": "intervia_workflow",
  "nodes": [
    {
      "name": "start_node",
      "type": "start",
      "metadata": {
        "position": {
          "x": 0,
          "y": 0
        }
      }
    },
    {
      "name": "say",
      "type": "say",
      "metadata": {
        "position": {
          "x": -513.3330385895275,
          "y": 135.06673890394853
        }
      },
      "prompt": "",
      "exact": "Hello! I'll be asking you a few questions and generate a proper interview for you! Let's get started"
    },
    {
      "name": "node_1746252480682",
      "type": "gather",
      "metadata": {
        "position": {
          "x": -66.99601198402942,
          "y": 164.8496916726962
        }
      },
      "output": {
        "type": "object",
        "required": [
          "role",
          "type",
          "level",
          "techstack",
          "amount"
        ],
        "properties": {
          "role": {
            "type": "string",
            "description": "What role are you interested in?\n"
          },
          "type": {
            "type": "string",
            "description": "Do you want a technical, behavioral or a mixed interview?"
          },
          "level": {
            "type": "string",
            "description": "The job experience level"
          },
          "amount": {
            "type": "string",
            "description": "How many questions would you like?"
          },
          "techstack": {
            "type": "string",
            "description": "A list of technologies to cover during the interview"
          }
        }
      }
    },
    {
      "name": "node_1746252947736",
      "type": "apiRequest",
      "metadata": {
        "position": {
          "x": -427.66060597889185,
          "y": 442.26890150834595
        }
      },
      "method": "POST",
      "url": "https://intervia-xi.vercel.app/api/vapi/generate",
      "headers": {
        "type": "object",
        "properties": {}
      },
      "body": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "value": "{{ role }}",
            "description": ""
          },
          "type": {
            "type": "string",
            "value": "{{ type }}",
            "description": ""
          },
          "level": {
            "type": "string",
            "value": "{{ level }}",
            "description": ""
          },
          "amount": {
            "type": "string",
            "value": "{{ amount }}",
            "description": ""
          },
          "userid": {
            "type": "string",
            "value": "{{ userid }}",
            "description": ""
          },
          "techstack": {
            "type": "string",
            "value": "{{ techstack }}",
            "description": ""
          }
        }
      },
      "output": null,
      "mode": "blocking"
    },
    {
      "name": "node_1746253237200",
      "type": "say",
      "metadata": {
        "position": {
          "x": -23.5582031756404,
          "y": 490.59958126505296
        }
      },
      "prompt": "Say that the interview has been generated and thank the user for the call and say best of luck for the interview",
      "exact": ""
    },
    {
      "name": "node_1746253338761",
      "type": "hangup",
      "metadata": {
        "position": {
          "x": -183.13130611906956,
          "y": 878.8222830436877
        }
      }
    }
  ],
  "edges": [
    {
      "from": "start_node",
      "to": "say"
    },
    {
      "from": "say",
      "to": "node_1746252480682"
    },
    {
      "from": "node_1746252480682",
      "to": "node_1746252947736"
    },
    {
      "from": "node_1746252947736",
      "to": "node_1746253237200"
    }
   
  ],

}

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