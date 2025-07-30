# Intervia - AI-Powered Interview Preparation Platform

Intervia is an advanced interview preparation platform that leverages AI to help users practice and improve their interview skills. Get real-time feedback, practice with AI-powered mock interviews, and track your progress to ace your next job interview.

## Getting Started

### Prerequisites

- Next.js 15.3.1 or later
- Node.js (comes with npm) or yarn
- Firebase account (for authentication and database)
- Vapi.ai account (for AI voice interactions)
- Google Gemini  (for interview and feedback generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishannkc/intervia.git
   cd intervia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # Firebase Configuration
    FIREBASE_PROJECT_ID = your_firebase_project_id
    FIREBASE_PRIVATE_KEY = your_firebase_private_key
    FIREBASE_CLIENT_EMAIL = your_firebase_client_email
    FIREBASE_WEB_API_KEY = your_firebase_web_api_key
  
   # Vapi.ai Configuration
   NEXT_PUBLIC_VAPI_WEB_TOKEN = your_vapi_web_token
   NEXT_PUBLIC_VAPI_WORKFLOW_ID = your_vapi_workflow_id
   
   # Google Gemini Configuration
   GOOGLE_GENERATIVE_AI_API_KEY = your_google_generative_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Technologies Used

- **Frontend**: Next.js 15, TypeScript, React 19
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication & Database**: Firebase
- **AI Voice**: Vapi.ai
- **AI Interview & Feedback**: Google Gemini
- **State Management**: React Hook Form, Zod for validation
- **UI Components**: Radix UI, Lucide Icons
- **Theming**: Next Themes

##  Dependencies

### Main Dependencies
- `next`: 15.3.1
- `react` & `react-dom`: ^19.0.0
- `firebase`: ^11.6.1
- `@vapi-ai/web`: ^2.3.0
- `ai`: ^4.3.13
- `shadcn/ui` components

### Development Dependencies
- `typescript`: ^5
- `tailwindcss`: ^4
- `eslint`: ^9

## 🌐 Deployment

To deploy this project, follow these steps:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

For production deployment, consider using platforms like Vercel, Netlify, or your preferred hosting service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
