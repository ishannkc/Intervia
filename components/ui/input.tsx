import * as React from "react"
// Import utility function for conditional class names
import { cn } from "@/lib/utils"

/**
 * Input Component
 * 
 * A customizable input component with built-in styling for various states and types.
 * Extends the native HTML input element with additional styling and accessibility features.
 * 
 * @component
 * @example
 * ```tsx
 * <Input type="text" placeholder="Enter your name" />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {string} [type='text'] - Input type (text, email, password, etc.)
 * @param {React.ComponentProps<'input'>} props - Additional HTML input props
 * @returns {React.ReactElement} A styled input element
 */
function Input({ className, type = 'text', ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"  // For easier targeting in tests and CSS
      className={cn(
        // Base styles
        [
          // Layout and typography
          'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base',
          'shadow-xs transition-[color,box-shadow] outline-none',
          
          // File input styles
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'file:text-foreground',
          
          // Placeholder and selection styling
          'placeholder:text-muted-foreground',
          'selection:bg-primary selection:text-primary-foreground',
          
          // Dark mode support
          'dark:bg-input/30 border-input',
          
          // Disabled state
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          
          // Responsive typography
          'md:text-sm'
        ].join(' '),
        
        // Focus states
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        
        // Error states
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        
        // Additional custom classes
        className
      )}
      {...props}
    />
  )
}

export { Input }
