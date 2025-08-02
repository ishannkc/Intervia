// Import types from VAPI SDK for TypeScript type checking
import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
// Import Zod for schema validation
import { z } from "zod";

/**
 * Configuration for the interview generation workflow
 * 
 * This object defines the structure and flow of the interview generation process
 * using VAPI's workflow system. It includes nodes for different stages of the
 * interview setup and the transitions between them.
 */

export const generator: CreateWorkflowDTO = 
{
  // Unique identifier for the workflow
  "name": "intervia_workflow",
  // Array of nodes that define the workflow steps
  "nodes": [
    // Starting point of the workflow
    {
      "name": "start_node",
      "type": "start",
      "metadata": {
        // UI positioning for workflow editor
        "position": {
          "x": 0,
          "y": 0
        }
      }
    },
    // Node for the initial greeting message
    {
      "name": "say",
      "type": "say",
      "metadata": {
        "position": {
          "x": -513.3330385895275,
          "y": 135.06673890394853
        }
      },
      // Empty prompt as we're using exact text
      "prompt": "",
      // Initial greeting message for the user
      "exact": "Hello! I'll be asking you a few questions and generate a proper interview for you! Let's get started"
    },
    // Node to gather interview parameters from the user
    {
      "name": "node_1746252480682",
      "type": "gather",
      "metadata": {
        "position": {
          "x": -66.99601198402942,
          "y": 164.8496916726962
        }
      },
      // Define the expected output structure from this node
      "output": {
        "type": "object",
        // Required fields that must be collected
        "required": [
          "role",
          "type",
          "level",
          "techstack",
          "amount"
        ],
        // Define each field's properties and descriptions
        "properties": {
          "role": {
            "type": "string",
            "description": "What role are you interested in?"
          },
          "type": {
            "type": "string",
            "description": "Do you want a technical, behavioral or a mixed interview?"
          },
          "level": {
            "type": "string",
            "description": "The job experience level (e.g., Entry, Mid, Senior)"
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
    // Node to make an API request to generate the interview
    {
      "name": "node_1746252947736",
      "type": "apiRequest",
      "metadata": {
        "position": {
          "x": -427.66060597889185,
          "y": 442.26890150834595
        }
      },
      // HTTP method for the API request
      "method": "POST",
      // Endpoint for generating the interview
      "url": "https://intervia-xi.vercel.app/api/vapi/generate",
      // Request headers (empty in this case)
      "headers": {
        "type": "object",
        "properties": {}
      },
      // Request body with template variables
      "body": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string",
            "value": "{{ role }}",
            "description": "The role the interview is being generated for"
          },
          "type": {
            "type": "string",
            "value": "{{ type }}",
            "description": "Type of interview (technical/behavioral/mixed)"
          },
          "level": {
            "type": "string",
            "value": "{{ level }}",
            "description": "Experience level for the interview"
          },
          "amount": {
            "type": "string",
            "value": "{{ amount }}",
            "description": "Number of questions to generate"
          },
          "userid": {
            "type": "string",
            "value": "{{ userid }}",
            "description": "ID of the user requesting the interview"
          },
          "techstack": {
            "type": "string",
            "value": "{{ techstack }}",
            "description": "Technologies to focus on in the interview"
          }
        }
      },
      // No specific output schema defined
      "output": null,
      // Block until the API request completes
      "mode": "blocking"
    },
    // Node for the closing message after interview generation
    {
      "name": "node_1746253237200",
      "type": "say",
      "metadata": {
        "position": {
          "x": -23.5582031756404,
          "y": 490.59958126505296
        }
      },
      // Instructions for the AI to generate a closing message
      "prompt": "Say that the interview has been generated and thank the user for the call and say best of luck for the interview",
      // Empty exact message to use the generated prompt
      "exact": ""
    },
    // Node to end the call after interview generation
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
  // Define the flow between nodes
  "edges": [
    // Start the flow with the greeting message
    {
      "from": "start_node",
      "to": "say"
    },
    // After greeting, gather interview parameters
    {
      "from": "say",
      "to": "node_1746252480682"
    },
    // After gathering parameters, generate the interview
    {
      "from": "node_1746252480682",
      "to": "node_1746252947736"
    },
    // After generation, provide closing message
    {
      "from": "node_1746252947736",
      "to": "node_1746253237200"
    }
    // Note: The hangup node is not connected in the flow
  ]
};

/**
 * Configuration for the AI Interviewer Assistant
 * 
 * This object defines the properties and behavior of the AI interviewer,
 * including voice settings, transcription, and initial message.
 */
export const interviewer: CreateAssistantDTO = {
  // Display name for the assistant
  name: "Interviewer",
  
  // Initial greeting message when the interview starts
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Are you ready for the interview?",
  
  // Speech-to-text configuration
  transcriber: {
    provider: "deepgram",  // Speech recognition service
    model: "nova-2",       // Deepgram model for transcription
    language: "en",        // Language for transcription
  },
  // Text-to-speech configuration
  voice: {
    provider: "11labs",    // Voice synthesis service
    voiceId: "ryan",       // Specific voice to use
    stability: 0.4,        // Voice stability (0-1)
    similarityBoost: 0.8,  // How closely to match the voice sample (0-1)
    speed: 0.9,            // Speaking rate (0.5-2.0)
    style: 0.5,            // Expressiveness of speech (0-1)
    useSpeakerBoost: true, // Enhance voice clarity
  },
  // AI model configuration
  model: {
    provider: "openai",    // AI model provider
    model: "gpt-4",        // Model version to use
    
    // System message to guide the AI's behavior
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

/**
 * Schema for interview feedback
 * 
 * Defines the structure and validation rules for interview feedback data,
 * including scores for different categories and overall assessment.
 */
export const feedbackSchema = z.object({
  // Overall score for the interview (0-100)
  totalScore: z.number(),
  
  // Detailed scores for specific assessment categories
  categoryScores: z.tuple([
    // Communication Skills assessment
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    // Technical Knowledge assessment
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    // Problem Solving assessment
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    // Cultural Fit assessment
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    // Confidence and Clarity assessment
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  // List of the candidate's strengths
  strengths: z.array(z.string()),
  // Areas where the candidate can improve
  areasForImprovement: z.array(z.string()),
  // Overall assessment and summary of the interview
  finalAssessment: z.string(),
});