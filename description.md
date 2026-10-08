# Intervia Project Description

## Project Summary

Intervia is an AI-powered mock-interview platform built with Next.js. Its main workflow is:

1. A user creates an account or signs in.
2. The user starts a voice conversation with Vapi.
3. Vapi collects the desired role, interview type, experience level, technologies, and question count.
4. Google Gemini generates interview questions.
5. The questions are saved to Firebase Firestore.
6. The user completes a second voice interview with an AI interviewer.
7. Gemini evaluates the interview transcript.
8. The user receives a score, category breakdown, strengths, and improvement areas.

The application is designed to help users practice technical, behavioral, and mixed job interviews through a conversational voice interface.

## Technology Stack

- Next.js 15.3.1 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Firebase Authentication
- Firebase Admin SDK
- Firebase Firestore
- Vapi Web SDK for voice interactions
- Google Gemini through the Vercel AI SDK
- Deepgram transcription through Vapi
- ElevenLabs voice synthesis through Vapi
- OpenAI GPT-4 as the Vapi interviewer model
- React Hook Form and Zod for forms and validation
- Sonner for toast notifications
- Radix UI and shadcn-style UI primitives
- Lucide icons
- Day.js for date formatting
- Mona Sans through `next/font/google`

Dependency configuration is located in `package.json`.

## Application Structure

### Root Configuration

- `app/layout.tsx` defines global metadata, the dark HTML theme, the Mona Sans font, global CSS, and the Sonner toaster.
- `app/globals.css` defines the theme, colors, gradients, layout utilities, buttons, cards, interview panels, forms, and animations.
- `next.config.ts` configures Next.js and currently disables build-time ESLint and TypeScript failures.
- `tsconfig.json` enables strict TypeScript and the `@/*` import alias.
- `eslint.config.mjs` uses Next.js Core Web Vitals and TypeScript rules.
- `components.json` configures the shadcn-style component aliases and Lucide icon library.
- `postcss.config.mjs` enables the Tailwind CSS PostCSS plugin.

### Route Groups

The application uses Next.js route groups:

- `(auth)` contains authentication pages and the centered authentication layout.
- `(root)` contains the main navigation and interview application pages.

## Routes

### `/`

The dashboard is implemented in `app/(root)/page.tsx`.

It:

- Retrieves the current server-side user.
- Displays a generate-interview call to action.
- Fetches interview records.
- Fetches feedback for displayed interviews.
- Renders interview cards.
- Links users to interview generation, interview-taking, and feedback pages.

### `/sign-up`

The sign-up page renders the reusable `AuthForm` with `type="sign-up"`.

### `/sign-in`

The sign-in page renders the reusable `AuthForm` with `type="sign-in"`.

### `/interview`

This page starts the interview-generation voice workflow. It retrieves the current user and renders `Agent` with `type="generate"`.

### `/interview/[id]`

This page loads an interview by document ID, displays its role and type, and starts the voice interview using the stored questions.

### `/interview/[id]/feedback`

This page retrieves the latest feedback for an interview and displays:

- Overall score
- Feedback date
- Final assessment
- Category scores and comments
- Strengths
- Areas for improvement
- A link back to the home page

### `/api/vapi/generate`

This API route receives interview-generation data, asks Gemini to generate questions, and stores the resulting interview in Firestore.

It also exposes a simple GET response returning `{ success: true, data: "Thank you!" }`.

## Authentication

Authentication is implemented through Firebase Authentication and Firebase Admin.

### Sign-up Flow

The client validates:

- Name must contain at least three characters.
- Email must have a valid format.
- Email must end with one of the supported domains: Gmail, Outlook, Hotmail, or Yahoo.
- Password must contain at least eight characters.
- Password cannot contain spaces.
- Password confirmation must match.

The client then:

1. Creates the account with Firebase Authentication.
2. Calls the `signUp` server action.
3. Stores the user name and email in Firestore under `users/{uid}`.
4. Redirects to `/sign-in`.

### Sign-in Flow

The client:

1. Authenticates with Firebase.
2. Retrieves a Firebase ID token.
3. Sends the email and ID token to the `signIn` server action.
4. The server validates the Firebase user.
5. Firebase Admin creates a one-week HTTP-only session cookie.
6. The user is redirected to `/`.

The session cookie is configured with:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "lax"`
- A one-week lifetime

### Logout Flow

`AuthButton.tsx` listens to Firebase client authentication state and displays a logout button on the home page when the user is authenticated.

Logout currently signs out of client Firebase Authentication and redirects to `/sign-in`. It does not clear the server-side `session` cookie.

## Interview Generation

The Vapi generation workflow is defined in `constants/index.ts`.

The workflow contains these stages:

1. Start node.
2. Introductory greeting.
3. Voice gathering of role, interview type, level, technology stack, and question amount.
4. HTTP request to the generation API.
5. Confirmation message.
6. Hangup.

The configured API URL is:

```text
https://intervia-xi.vercel.app/api/vapi/generate
```

The API calls Gemini with a prompt containing:

- Job role
- Experience level
- Technology stack
- Interview type
- Requested question count

Gemini is asked to return a JSON array of questions suitable for a voice assistant. The API parses that response and stores an interview document.

## Interview Data

Each generated interview contains:

```text
role
 type
level
techstack
questions
userId
finalized
createdAt
```

The interview is immediately stored with `finalized: true`, even though the candidate has not yet completed the actual interview.

## Voice Interview Experience

The reusable `Agent` component manages the Vapi call lifecycle.

It tracks these statuses:

- `INACTIVE`
- `CONNECTING`
- `ACTIVE`
- `FINISHED`

It also tracks:

- Whether the AI is speaking
- Final transcript messages
- The current user name
- The interview type
- The interview questions

The component registers Vapi listeners for:

- Call start
- Call end
- Transcript messages
- Speech start
- Speech end
- Errors

Only final transcript messages are stored. The latest transcript message is shown in the interface.

### Generation Call

For generation calls, the component starts the Vapi workflow and passes the user name and user ID as workflow variables. When the call ends, the user is redirected to the home page.

### Interview Call

For actual interviews, the component formats the stored questions and injects them into the Vapi interviewer prompt. When the call ends, it sends the locally stored transcript to the feedback server action.

## Vapi Interviewer

The interviewer assistant is configured with:

- Deepgram `nova-2` transcription
- English language
- ElevenLabs voice `ryan`
- OpenAI GPT-4
- A professional interviewer system prompt
- Natural follow-up questions
- Short voice responses
- A five-second pause timeout

The interviewer is instructed to:

- Ask the configured questions.
- React naturally to candidate responses.
- Ask short follow-up questions when necessary.
- Remain professional and welcoming.
- Conclude the interview politely.
- Avoid long or robotic responses.

## Feedback Generation

Feedback is generated by `createFeedback` in `lib/actions/general.action.ts`.

The transcript is converted into a text prompt and sent to Gemini using `generateObject` and a Zod schema.

The feedback contains:

- `totalScore`
- `categoryScores`
- `strengths`
- `areasForImprovement`
- `finalAssessment`

The requested evaluation categories are:

- Communication Skills
- Technical Knowledge
- Problem Solving
- Cultural Fit
- Confidence and Clarity

Feedback is saved in the `feedback` Firestore collection with the associated interview ID, user ID, score information, comments, and creation timestamp.

The feedback page retrieves the latest matching feedback document using interview ID, user ID, and descending creation date.

## Firestore Data Model

### Users

Collection:

```text
users/{firebaseUid}
```

Fields:

```text
name
email
```

### Interviews

Collection:

```text
interviews/{interviewId}
```

Fields:

```text
role
type
level
techstack
questions
userId
finalized
createdAt
```

### Feedback

Collection:

```text
feedback/{feedbackId}
```

Fields:

```text
interviewId
userId
totalScore
categoryScores
strengths
areasForImprovement
finalAssessment
createdAt
```

## Server Actions

`lib/actions/auth.action.ts` provides:

- `signUp`
- `signIn`
- `setSessionCookie`
- `getCurrentUser`
- `isAuthenticated`

`lib/actions/general.action.ts` provides:

- `getInterviewByUserId`
- `getLatestInterviews`
- `getInterviewById`
- `createFeedback`
- `getFeedbackByInterviewId`

## UI Components

### `AuthForm`

Reusable sign-in and sign-up form using React Hook Form, Zod, Firebase Authentication, and Sonner notifications.

### `FormField`

Generic React Hook Form field wrapper with support for text, email, password, and file inputs. Password fields include show/hide behavior.

### `AuthButton`

Client-side authentication-state listener that displays the logout action on the dashboard.

### `Agent`

Voice interaction controller for both question generation and mock interviews.

### `InterviewCard`

Displays an interview role, level, type, date, technology stack, feedback summary, score, and navigation actions.

### `TechStackDisplay`

Formats and displays a limited number of technology-stack badges.

### UI Primitives

The `components/ui` directory contains shadcn-style components for:

- Buttons
- Forms
- Inputs
- Labels
- Toast notifications

## Visual Design

The interface uses a dark visual language with:

- Dark charcoal backgrounds
- Light lavender primary text and actions
- Purple-blue gradients
- Green call controls
- Red disconnect controls
- Rounded cards and controls
- Gradient borders
- Background pattern imagery
- Animated speaking indicators
- Transcript fade-in animation

The global layout applies dark mode unconditionally through `<html className="dark">`.

Assets are stored in `public`, including:

- Logo images
- User avatar image
- Calendar icon
- Star icon
- Background pattern
- Background image

Design references are stored in the top-level `design` directory.

## Environment Variables

The application expects these variables in `.env.local`:

```text
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
FIREBASE_WEB_API_KEY
GOOGLE_GENERATIVE_AI_API_KEY
NEXT_PUBLIC_VAPI_WEB_TOKEN
NEXT_PUBLIC_VAPI_WORKFLOW_ID
```

Firebase web configuration is also present in the client Firebase initialization file. The Firebase web API key is not treated as a server secret, while Admin SDK credentials must remain private.

## Major Implementation Gaps and Risks

### Dashboard query behavior

The dashboard calls `getLatestInterviews({ userId })`, while `getLatestInterviews` filters with:

```text
where('userId', '!=', userId)
```

This means the displayed interview cards can belong to other users instead of the signed-in user. The current user’s interview collection is only used to calculate whether any records exist, and that boolean is not used to render the cards.

### Missing server-side route protection

There is no middleware enforcing authentication. Several pages call `getCurrentUser`, but interview and feedback routes can continue rendering with missing user data.

### Missing ownership checks

`getInterviewById` loads any interview by ID without checking ownership. A user who knows another interview ID may be able to access it.

Feedback lookup and creation also rely on IDs supplied by the client without independently verifying ownership against the session cookie.

### Unauthenticated generation endpoint

The generation API accepts a client-provided `userid` and writes a Firestore record without verifying the authenticated server session.

### Client-controlled feedback

The transcript, user ID, and interview ID used to create feedback are supplied from the browser. A malicious client could submit arbitrary transcript content or associate feedback with another record.

### Missing API validation

The API does not validate:

- Role
- Interview type
- Level
- Technology stack
- Question count
- User ID
- Request body shape
- Maximum input sizes

### Prompt injection and cost exposure

User-provided values are directly interpolated into Gemini prompts. There are no visible rate limits, abuse controls, or input-size restrictions.

### Fragile question parsing

The generation route expects Gemini to return valid JSON text and calls `JSON.parse` directly. Invalid or extra model output causes the request to fail.

### Feedback category mismatch

The prompt refers to categories such as `Problem-Solving`, `Cultural & Role Fit`, and `Confidence & Clarity`, while the Zod schema requires `Problem Solving`, `Cultural Fit`, and `Confidence and Clarity`. This may cause structured-output validation failures.

### Session logout issue

Client Firebase logout does not invalidate the HTTP-only server session cookie. The server session may remain valid for up to one week.

### Transcript loss

The transcript is stored only in React state. Browser crashes, refreshes, connection failures, or unexpected call termination can lose the interview data.

### Feedback duplication

Every retake creates another feedback document. Older results remain stored even though only the latest result is displayed.

### Hard-coded deployment URL

The Vapi workflow calls a fixed production URL, which makes local development, preview deployments, and staging environments dependent on the production endpoint.

### Global console override

`lib/vapi.sdk.ts` overrides `console.error` globally to suppress selected Vapi errors. This can hide unrelated application errors.

### Accessibility issues

The password visibility control is a clickable `div` rather than a semantic button. Form validation messages are mainly shown through toast notifications, while `FormMessage` is imported but not rendered by `FormField`.

## Code Quality Findings

The production build currently succeeds, but `next.config.ts` contains:

```typescript
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
}
```

Therefore, a successful production build does not guarantee that the project passes TypeScript or ESLint.

Independent TypeScript validation found:

- An optional user name passed to `Agent` where a required string is expected.
- A Vapi `CreateAssistantDTO` missing required `clientMessages` and `serverMessages` properties.

Lint validation found issues involving:

- Explicit `any` types
- Unused variables and imports
- Unsafe non-null assertions
- Missing React hook dependencies
- Unescaped JSX text

There is no visible automated test suite in the project.

The untracked `constants/Untitled-1.py` file appears unrelated to Intervia and contains a basic two-sum exercise.

## Documented Features Versus Implemented Features

The README describes:

- AI-powered mock interviews
- Real-time feedback
- Comprehensive analysis
- Progress tracking
- Customizable interviews
- Voice interaction
- Gemini feedback
- Firebase data storage

The source clearly implements voice interaction, AI question generation, feedback generation, authentication, interview storage, and feedback display.

The following documented features are not represented by dedicated current routes or visible UI:

- Analytics dashboards
- Long-term progress charts
- Dedicated progress tracking
- Advanced interview history management
- Broad difficulty controls
- User profile management

## Overall Assessment

Intervia has a coherent prototype architecture and a compelling end-to-end workflow. Its strongest feature is the combination of voice-based interview generation, conversational interviewing, and structured AI feedback.

The application currently resembles an academic, demonstration, or early-stage product prototype rather than a production-ready platform. The most important next improvements are:

1. Enforce server-side authentication and ownership checks.
2. Correct the dashboard query to display the current user’s interviews.
3. Validate all API inputs with Zod.
4. Derive user identity from the verified session instead of request data.
5. Clear the server session cookie during logout.
6. Replace raw JSON parsing with structured Gemini output validation.
7. Persist transcripts and handle interrupted calls.
8. Enable TypeScript and ESLint checks during builds.
9. Add automated tests for authentication, generation, feedback, and ownership boundaries.
10. Replace the hard-coded API URL with environment-specific configuration.
