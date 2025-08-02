/**
 * Enumerates the types of messages that can be exchanged with the VAPI service
 */
enum MessageTypeEnum {
  /** Transcript message containing speech-to-text content */
  TRANSCRIPT = "transcript",
  /** Message representing a function call */
  FUNCTION_CALL = "function-call",
  /** Message containing the result of a function call */
  FUNCTION_CALL_RESULT = "function-call-result",
  /** Message to add to the conversation history */
  ADD_MESSAGE = "add-message",
}

/**
 * Enumerates the roles of message senders in the conversation
 */
enum MessageRoleEnum {
  /** Message from the end user */
  USER = "user",
  /** System message (e.g., instructions to the assistant) */
  SYSTEM = "system",
  /** Message from the AI assistant */
  ASSISTANT = "assistant",
}

/**
 * Enumerates the types of transcript messages
 */
enum TranscriptMessageTypeEnum {
  /** Partial transcript (incremental updates) */
  PARTIAL = "partial",
  /** Final transcript (completed utterance) */
  FINAL = "final",
}

/**
 * Base interface for all message types
 */
interface BaseMessage {
  /** The type of message */
  type: MessageTypeEnum;
}

/**
 * Represents a speech-to-text transcript message
 */
interface TranscriptMessage extends BaseMessage {
  /** Fixed type for transcript messages */
  type: MessageTypeEnum.TRANSCRIPT;
  /** Role of the speaker */
  role: MessageRoleEnum;
  /** Whether this is a partial or final transcript */
  transcriptType: TranscriptMessageTypeEnum;
  /** The transcribed text content */
  transcript: string;
}

/**
 * Represents a function call request from the assistant
 */
interface FunctionCallMessage extends BaseMessage {
  /** Fixed type for function call messages */
  type: MessageTypeEnum.FUNCTION_CALL;
  /** Details of the function call */
  functionCall: {
    /** Name of the function to call */
    name: string;
    /** Parameters to pass to the function */
    parameters: unknown;
  };
}

/**
 * Represents the result of a function call
 */
interface FunctionCallResultMessage extends BaseMessage {
  /** Fixed type for function call result messages */
  type: MessageTypeEnum.FUNCTION_CALL_RESULT;
  /** Details of the function call result */
  functionCallResult: {
    /** Whether to forward this result to the client */
    forwardToClientEnabled?: boolean;
    /** The result of the function call */
    result: unknown;
    /** Additional properties */
    [a: string]: unknown;
  };
}

/**
 * Union type representing any valid message in the VAPI system
 */
type Message =
  | TranscriptMessage
  | FunctionCallMessage
  | FunctionCallResultMessage;
