// Client component since it uses React hooks and browser APIs
"use client"

// Import theme hook for dark/light mode support
import { useTheme } from "next-themes"
// Import Sonner toast component and its types
import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Toaster Component
 * 
 * A toast notification component built on top of Sonner.
 * Provides styled toast notifications that respect the application's theme.
 * 
 * @component
 * @param {ToasterProps} props - Props for the Sonner Toaster component
 * @returns {React.ReactElement} A configured Toaster instance
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Toaster />
 * 
 * // With custom position
 * <Toaster position="top-center" />
 * ```
 */
const Toaster = ({ ...props }: ToasterProps) => {
  // Get the current theme (light/dark/system)
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      // Apply the current theme to the toaster
      theme={theme as ToasterProps["theme"]}
      // Base class for styling
      className="toaster group"
      // Custom CSS variables for theming
      style={{
        // Background color for normal toasts
        "--normal-bg": "var(--popover)",
        // Text color for normal toasts
        "--normal-text": "var(--popover-foreground)",
        // Border color for normal toasts
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      // Pass through any additional props
      {...props}
    />
  )
}

export { Toaster }
