// Client component since it uses browser APIs and interactivity
"use client"

import * as React from "react"
// Import Radix UI Label primitive for accessible label behavior
import * as LabelPrimitive from "@radix-ui/react-label"
// Import utility function for conditional class names
import { cn } from "@/lib/utils"

/**
 * Label Component
 * 
 * A reusable label component that provides accessible labeling for form controls.
 * Built on top of Radix UI's Label primitive with additional styling and states.
 * 
 * @component
 * @example
 * ```tsx
 * <Label htmlFor="username">Username</Label>
 * <Input id="username" />
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ComponentProps<typeof LabelPrimitive.Root>} props - Additional props for Radix UI Label
 * @returns {React.ReactElement} A styled label element
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"  // For easier targeting in tests and CSS
      className={cn(
        // Base styles
        [
          // Layout and typography
          'flex items-center gap-2',
          'text-sm leading-none font-medium select-none',
          
          // Disabled state when parent group is disabled
          'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
          
          // Disabled state when associated form control is disabled
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
        ].join(' '),
        // Additional custom classes
        className
      )}
      {...props}
    />
  )
}

export { Label }
