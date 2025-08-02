import * as React from "react"
// Import Radix UI Slot component for polymorphic component support
import { Slot } from "@radix-ui/react-slot"
// Import class-variance-authority for creating type-safe component variants
import { cva, type VariantProps } from "class-variance-authority"
// Import utility function for conditional class names
import { cn } from "@/lib/utils"

/**
 * Button variants configuration using class-variance-authority
 * Defines all possible button styles and sizes with their respective classes
 */
const buttonVariants = cva(
  // Base styles applied to all buttons
  [
    // Layout and typography
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    // Transitions and interactions
    "transition-all disabled:pointer-events-none disabled:opacity-50",
    // Icon handling
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    // Focus states
    "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    // Error states
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
  ].join(' '),
  {
    variants: {
      // Button style variants
      variant: {
        // Primary button - used for main actions
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // Destructive button - used for dangerous actions like delete
        destructive: [
          "bg-destructive text-white shadow-xs hover:bg-destructive/90",
          "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60"
        ].join(' '),
        // Outline button - used for secondary actions
        outline: [
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
          "dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
        ].join(' '),
        // Secondary button - used for less prominent actions
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // Ghost button - used for subtle actions
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // Link button - used for navigation actions
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Button size variants
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",  // Default size
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",  // Small size
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",  // Large size
        icon: "size-9",  // Square icon button
      },
    },
    // Default variants when none are specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component
 * 
 * A highly customizable button component with multiple variants and sizes.
 * Supports polymorphic behavior through the `asChild` prop.
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">Click me</Button>
 * ```
 * 
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {'default'|'destructive'|'outline'|'secondary'|'ghost'|'link'} [variant='default'] - Button style variant
 * @param {'default'|'sm'|'lg'|'icon'} [size='default'] - Button size
 * @param {boolean} [asChild=false] - Whether to use the `asChild` pattern for composition
 * @param {React.ComponentProps<'button'>} props - Additional HTML button props
 * @returns {React.ReactElement} A styled button element
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // Use Slot when asChild is true to enable composition with other components
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"  // For easier targeting in tests and CSS
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
