/**
 * PostCSS configuration for the Intervia project
 * 
 * This configuration sets up PostCSS with the necessary plugins for processing CSS.
 * It's used by Next.js to transform CSS with JavaScript plugins.
 */
const config = {
  // Configure PostCSS plugins
  // @tailwindcss/postcss is the recommended way to use Tailwind CSS with PostCSS
  plugins: [
    "@tailwindcss/postcss", // Includes Tailwind CSS and PostCSS configuration
  ],
};

export default config;
