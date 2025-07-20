import Vapi from '@vapi-ai/web';

//error handling for vapi which are not critical
const originalConsoleError = console.error;
console.error = (...args) => {

  const shouldIgnore = args.some(arg => {
    if (typeof arg === 'string') {
      return (
        arg.includes('Meeting ended due to ejection') ||
        arg === 'VAPI Error:'
      );
    }
   
    if (typeof arg === 'object' && arg !== null && Object.keys(arg).length === 0) {
      return args[0] === 'VAPI Error:';
    }
    return false;
  });
  
  if (!shouldIgnore) {
    originalConsoleError.apply(console, args);
  }
};


export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);

//ignore and supress vapi errors(not critical)
vapi.on('error', () => {
}); 
