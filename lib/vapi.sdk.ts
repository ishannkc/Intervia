// Import the Vapi SDK for AI-powered voice interactions
import Vapi from '@vapi-ai/web';

/**
 * VAPI SDK Configuration and Error Handling
 * 
 * This module configures the Vapi SDK for AI-powered voice interactions
 * and sets up custom error handling to filter out common, non-critical errors.
 */

// Store the original console.error function to restore it later if needed
const originalConsoleError = console.error;

/**
 * Custom console.error implementation to filter out common VAPI-related errors
 * that don't require developer attention.
 */
console.error = (...args) => {
  // Check if any of the error arguments should be ignored
  const shouldIgnore = args.some(arg => {
    // Ignore empty error objects
    if (typeof arg === 'object' && arg !== null && Object.keys(arg).length === 0) {
      return true;
    }
    
    // Ignore specific VAPI error messages
    if (typeof arg === 'string') {
      return (
        // Common VAPI error messages that can be safely ignored
        arg.includes('Meeting ended due to ejection') ||
        arg === 'VAPI Error:' ||
        arg.includes('VAPI Error')
      );
    }
    
    return false;
  });
  
  // Only log the error if it's not in the ignore list
  if (!shouldIgnore) {
    originalConsoleError.apply(console, args);
  }
};

/**
 * Initialize the Vapi client with the API token from environment variables
 * The token is required for authenticating with the VAPI service
 * 
 * @type {Vapi} - The configured Vapi client instance
 */
export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

/**
 * Global error handler for VAPI events
 * Filters out common errors and logs the rest in development mode
 */
vapi.on('error', (error) => {
  // Ignore meeting ejection errors as they're handled by the UI
  if (error?.message?.includes('Meeting ended due to ejection')) {
    return;
  }
  
  // Log other errors in development mode for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[VAPI] Error:', error);
  }
});
