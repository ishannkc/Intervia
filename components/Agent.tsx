'use client'  // Marking this as a Client Component in Next.js

// Import utility functions and hooks
import { cn } from '@/lib/utils';  // Utility for class name manipulation
import Image from 'next/image'      // Optimized image component
import { useRouter } from 'next/navigation';  // For programmatic navigation
import { useEffect, useState } from 'react';  // React hooks for state and side effects

// Import Vapi SDK and configuration
import { vapi } from '@/lib/vapi.sdk';  // Voice AI SDK
import { generator, interviewer } from '@/constants';  // Interview configuration

// Import actions
import { createFeedback } from '@/lib/actions/general.action';  // Action to save feedback

/**
 * Enum representing the different states of a call
 */
enum CallStatus {
    INACTIVE = 'INACTIVE',    // Call has not started
    CONNECTING = 'CONNECTING', // Call is being established
    ACTIVE = 'ACTIVE',        // Call is in progress
    FINISHED = 'FINISHED',    // Call has ended
}

/**
 * Interface for storing message history
 */
interface SavedMessage {
    role: 'user' | 'system' | 'assistant';  // Sender of the message
    content: string;  // Message content
}

/**
 * Agent Component
 * Manages the interview session with voice interaction
 * 
 * @param {string} userName - Name of the current user
 * @param {string} userId - ID of the current user
 * @param {'generate' | 'interview'} type - Type of agent (generate new interview or conduct interview)
 * @param {string} [interviewId] - ID of the interview (for existing interviews)
 * @param {string[]} [questions] - List of questions for the interview
 */
const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    // Initialize router for navigation
    const router = useRouter();
    
    // State management
    const [isSpeaking, setIsSpeaking] = useState(false);  // Tracks if AI is currently speaking
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);  // Current call status
    const [messages, setMessages] = useState<SavedMessage[]>([]);  // Transcript of the conversation

    // Set up event listeners for the voice call
    useEffect(() => {
        // Handler for when call starts
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        
        // Handler for when call ends
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        // Handler for processing new messages/transcripts
        const onMessage = (message: Message) => {
            // Only process final transcripts (not interim results)
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { 
                    role: message.role, 
                    content: message.transcript 
                };
                setMessages((prev) => [...prev, newMessage]);
            }
        };

        // Handlers for speech detection
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        // Error handler (ignores non-critical errors)
        const onError = (error: Error) => {
            // Ignore meeting ejection errors as they're not critical
            if (!error.message?.includes('Meeting ended due to ejection')) {
                console.log('Error', error);
            }
        };

        // Register event listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        // Cleanup function to remove event listeners
        return () => {
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError);
            vapi.off('call-start', onCallStart);
        };
    }, [])  // Empty dependency array means this runs once on mount

    /**
     * Handles feedback generation after an interview
     * @param {SavedMessage[]} messages - Transcript of the interview
     */
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generating feedback...');

        try {
            // Create feedback using the interview transcript
            const { success, feedbackId: id } = await createFeedback({
                interviewId: interviewId!,  // Non-null assertion as we know it exists
                userId: userId!,           // Non-null assertion as we know it exists
                transcript: messages       // The conversation transcript
            });

            // Navigate based on feedback creation result
            if (success && id) {
                // Go to feedback page if successful
                router.push(`/interview/${interviewId}/feedback`);
            } else {
                console.error('Error saving feedback');
                router.push('/');  // Return home on error
            }
        } catch (error) {
            console.error('Error in handleGenerateFeedback:', error);
            router.push('/');  // Return home on error
        }
    }

    // Handle post-call actions when call status changes to FINISHED
    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === 'generate') {
                // For new interviews, return to home after completion
                router.push('/');
            } else {
                // For existing interviews, generate feedback
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId]);  // Re-run when any of these dependencies change

    /**
     * Handles the initiation of a call with the Vapi AI
     */
    const handleCall = async () => {
        // Update UI to show connecting state
        setCallStatus(CallStatus.CONNECTING);

        try {
            if (type === "generate") {
                // Start a new interview generation call
                await vapi.start(
                    undefined,  // No specific agent ID for generation
                    {
                        variableValues: {
                            username: userName,
                            userid: userId,
                        },
                    } as any,  // Type assertion for Vapi SDK compatibility
                    undefined,  // No specific assistant ID
                    generator  // Use the generator configuration
                );
            } else {
                // Format questions for the interview
                let formattedQuestions = "";
                if (questions) {
                    formattedQuestions = questions
                        .map((question) => `- ${question}`)
                        .join("\n");  // Format as bullet points
                }

                // Start an interview with the provided questions
                await vapi.start(interviewer, {
                    variableValues: {
                        questions: formattedQuestions,
                    },
                } as any);  // Type assertion for Vapi SDK compatibility
            }
        } catch (error) {
            console.error("Error starting call:", error);
            // Reset to inactive state on error
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    /**
     * Handles disconnecting from an active call
     */
    const handleDisconnect = async () => {
        // Update call status to finished
        setCallStatus(CallStatus.FINISHED);
        
        // Stop the Vapi call
        vapi.stop();
    }

    // Get the most recent message for display
    const latestMessage = messages[messages.length - 1]?.content;
    
    // Helper variable to check call state
    const isCallInactiveOrFinished = 
        callStatus === CallStatus.INACTIVE || 
        callStatus === CallStatus.FINISHED;

  return (
    <>
        {/* Main call interface */}
        <div className="call-view">
            {/* AI Interviewer card */}
            <div className="card-interviewer">
                <div className="avatar">
                    {/* AI avatar with speaking animation */}
                    <Image 
                        src="/logo-icon.png" 
                        alt="AI Interviewer" 
                        width={65} 
                        height={54} 
                        className="object-cover" 
                    />
                    {/* Visual indicator when AI is speaking */}
                    {isSpeaking && <span className="animate-speak"/>}
                </div>
                <h3>AI Interviewer</h3>
            </div>
            
            {/* User card */}
            <div className="card-border">
                <div className="card-content">
                    <Image 
                        src="/user-icon.png" 
                        alt="User profile" 
                        width={540} 
                        height={540} 
                        className="rounded-full object-cover size-[120px]"
                    />
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>
        {/* Conversation transcript display */}
        {messages.length > 0 && (
            <div className="transcript-border">
                <div className="transcript">
                    {/* Animate the latest message with fade-in effect */}
                    <p 
                        key={latestMessage} 
                        className={cn(
                            'transition-opacity duration-500 opacity-0', 
                            'animate-fadeIn opacity-100'
                        )}
                    >
                        {latestMessage}
                    </p>
                </div>
            </div>
        )}

        {/* Call control buttons */}
        <div className="w-full flex justify-center">
            {callStatus !== "ACTIVE" ? (
                // Call/Connect button with loading state
                <button 
                    className="relative btn-call" 
                    onClick={handleCall}
                    disabled={callStatus === 'CONNECTING'}
                >
                    {/* Pulsing animation when connecting */}
                    <span 
                        className={cn(
                            'absolute animate-ping rounded-full opacity-75', 
                            callStatus !== 'CONNECTING' && 'hidden'
                        )}
                    />
                    <span>
                        {isCallInactiveOrFinished ? 'Start Interview' : 'Connecting...'}
                    </span>
                </button>
            ) : (
                // End call button (shown when call is active)
                <button 
                    className="btn-disconnect" 
                    onClick={handleDisconnect}
                >
                    End Interview
                </button>
            )}
        </div>
    </>
    
  )
}

export default Agent