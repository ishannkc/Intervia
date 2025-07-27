import { cn } from "@/lib/utils";

interface TechStackDisplayProps {
  techStack?: string[];
  maxItems?: number;
  className?: string;
}

// Helper function to format tech stack names with proper title case
const formatTechName = (name: string): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .split(/[\s-]+/) // Split by spaces or hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const TechStackDisplay = ({ 
  techStack = [], 
  maxItems = 4,
  className = ''
}: TechStackDisplayProps) => {
  if (!techStack || techStack.length === 0) return null;

  // Process tech stack names with proper title case formatting
  const displayItems = techStack
    .filter(Boolean) // Remove any empty/null items
    .slice(0, maxItems) // Limit to maxItems
    .map(tech => formatTechName(tech));

  if (displayItems.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayItems.map((tech, index) => (
        <span 
          key={`${tech}-${index}`}
          className="px-3 py-1 text-sm rounded-full bg-dark-300 text-light-100"
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

export default TechStackDisplay;
