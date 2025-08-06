import Vapi from '@vapi-ai/web';

const originalConsoleError = console.error;

console.error = (...args) => {

  const shouldIgnore = args.some(arg => {

    if (typeof arg === 'object' && arg !== null && Object.keys(arg).length === 0) {
      return true;
    }
  
    if (typeof arg === 'string') {
      return (
        arg.includes('Meeting ended due to ejection') ||
        arg === 'VAPI Error:' ||
        arg.includes('VAPI Error')
      );
    }
    
    return false;
  });
  

  if (!shouldIgnore) {
    originalConsoleError.apply(console, args);
  }
};

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);


vapi.on('error', (error) => {

  if (error?.message?.includes('Meeting ended due to ejection')) {
    return;
  }
  
 
  if (process.env.NODE_ENV === 'development') {
    console.log('[VAPI] Error:', error);
  }
});