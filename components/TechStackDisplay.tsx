// Import utility function for conditional class names
import { cn } from "@/lib/utils";

/**
 * Props interface for the TechStackDisplay component
 */
interface TechStackDisplayProps {
  techStack?: string[];     // Array of technology names to display
  maxItems?: number;        // Maximum number of tech items to show (default: 4)
  className?: string;       // Additional CSS classes for customization
}

/**
 * Formats a technology name to title case
 * @param {string} name - The raw technology name to format
 * @returns {string} Formatted technology name in title case
 * 
 * Example:
 * - 'react-js' becomes 'React Js'
 * - 'node.js' becomes 'Node.js'
 * - 'TYPESCRIPT' becomes 'Typescript'
 */
const formatTechName = (name: string): string => {
  // Return empty string for falsy input
  if (!name) return '';
  
  return name
    .toLowerCase()                    // Convert to lowercase first
    .split(/[\s-]+/)                 // Split on spaces or hyphens
    .map(word => 
      word.charAt(0).toUpperCase() +  // Capitalize first letter
      word.slice(1)                   // Keep the rest of the word as is
    )
    .join(' ');                       // Join with spaces
};

/**
 * TechStackDisplay Component
 * Displays a list of technology names as styled tags/pills
 * 
 * Features:
 * - Limits the number of displayed items
 * - Formats technology names consistently
 * - Handles empty or undefined tech stacks gracefully
 * - Supports custom styling through className prop
 */
const TechStackDisplay = ({ 
  techStack = [],   // Default to empty array if not provided
  maxItems = 4,     // Default to showing 4 items
  className = ''    // Additional classes for customization
}: TechStackDisplayProps) => {
  // Return null if no tech stack is provided or it's empty
  if (!techStack || techStack.length === 0) return null;

  // Process the tech stack array:
  // 1. Filter out any falsy values
  // 2. Limit to maxItems
  // 3. Format each tech name
  const displayItems = techStack
    .filter(Boolean)                   // Remove any empty/null/undefined items
    .slice(0, maxItems)                // Limit to specified number of items
    .map(tech => formatTechName(tech)); // Format each tech name

  // If no valid items after filtering, don't render anything
  if (displayItems.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayItems.map((tech, index) => (
        <span 
          key={`${tech}-${index}`}  // Use both tech name and index for unique keys
          className="px-3 py-1 text-sm rounded-full bg-dark-300 text-light-100"
          aria-label={`Technology: ${tech}`}
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

export default TechStackDisplay;
