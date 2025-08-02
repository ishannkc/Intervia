// Client component since it uses React hooks and browser APIs
"use client"

import * as React from "react"
// Import Radix UI primitives for accessible form components
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
// Import React Hook Form utilities for form management
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

// Import utility function for conditional class names
import { cn } from "@/lib/utils"
// Import custom Label component
import { Label } from "@/components/ui/label"

/**
 * Form Component
 * Wraps the FormProvider from react-hook-form for form state management
 */
const Form = FormProvider

/**
 * Type for form field context value
 * @template TFieldValues - The type of the form values
 * @template TName - The path to the field in the form values
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

// Create a React context for form field values
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * FormField Component
 * 
 * A wrapper around React Hook Form's Controller that provides form field context
 * to child components and handles form field registration and validation.
 * 
 * @component
 * @template TFieldValues - The type of the form values
 * @template TName - The path to the field in the form values
 * 
 * @example
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="username"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Username</FormLabel>
 *       <FormControl>
 *         <Input {...field} />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  // Provide the field name to child components via context
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * useFormField Hook
 * 
 * A custom hook that provides form field state and utilities to form components.
 * Must be used within a FormField component.
 * 
 * @returns {Object} Form field state and utility functions
 * @throws {Error} If used outside of a FormField component
 */
const useFormField = () => {
  // Get the field context (contains field name)
  const fieldContext = React.useContext(FormFieldContext)
  // Get the form item context (contains unique ID)
  const itemContext = React.useContext(FormItemContext)
  // Get the form context
  const { getFieldState } = useFormContext()
  // Get the current form state for this field
  const formState = useFormState({ name: fieldContext.name })
  // Get the field state (error, touched, etc.)
  const fieldState = getFieldState(fieldContext.name, formState)

  // Ensure this hook is used within a FormField
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  // Return field state and generated IDs for accessibility
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,  // ID for the form item container
    formDescriptionId: `${id}-form-item-description`,  // ID for the description
    formMessageId: `${id}-form-item-message`,  // ID for the error message
    ...fieldState,  // Include field state (error, isTouched, isDirty, etc.)
  }
}

/**
 * Type for form item context value
 */
type FormItemContextValue = {
  id: string  // Unique identifier for the form item
}

// Create a React context for form item values
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * FormItem Component
 * 
 * A container component for form fields that provides a consistent layout
 * and spacing between form elements.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} A form item container
 * 
 * @example
 * ```tsx
 * <FormItem>
 *   <FormLabel>Username</FormLabel>
 *   <FormControl>
 *     <Input />
 *   </FormControl>
 *   <FormMessage />
 * </FormItem>
 * ```
 */
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  // Generate a unique ID for this form item
  const id = React.useId()

  // Provide the ID to child components via context
  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

/**
 * FormLabel Component
 * 
 * A label component for form fields that automatically associates with
 * the form control and shows error states.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - The label text
 * @returns {React.ReactElement} A form label element
 * 
 * @example
 * ```tsx
 * <FormLabel>Email Address</FormLabel>
 * ```
 */
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  // Get form field state and IDs
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}  // For styling based on error state
      className={cn("data-[error=true]:text-destructive", className)}  // Apply error styles
      htmlFor={formItemId}  // Associate label with form control
      {...props}
    />
  )
}

/**
 * FormControl Component
 * 
 * A wrapper component for form controls that handles accessibility attributes
 * and error states.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The form control element
 * @returns {React.ReactElement} A form control wrapper
 * 
 * @example
 * ```tsx
 * <FormControl>
 *   <Input />
 * </FormControl>
 * ```
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  // Get form field state and IDs
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}  // For associating with label
      aria-describedby={
        // Include both description and error message IDs for accessibility
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}  // Indicate error state to assistive technologies
      {...props}
    />
  )
}

/**
 * FormDescription Component
 * 
 * A component for displaying help text or descriptions for form fields.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ReactNode} props.children - The description text
 * @returns {React.ReactElement} A description element
 * 
 * @example
 * ```tsx
 * <FormDescription>
 *   Your password must be at least 8 characters long.
 * </FormDescription>
 * ```
 */
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  // Get the description ID for accessibility
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}  // For association with form control
      className={cn("text-muted-foreground text-sm", className)}  // Muted text style
      {...props}
    />
  )
}

/**
 * FormMessage Component
 * 
 * A component for displaying validation error messages for form fields.
 * Only renders when there's an error or custom content is provided.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [className] - Additional CSS classes to apply
 * @param {React.ReactNode} [props.children] - Custom error message (overrides validation error)
 * @returns {React.ReactElement | null} An error message element or null if no error
 * 
 * @example
 * ```tsx
 * <FormMessage />
 * 
 * // Custom error message
 * <FormMessage>This field is required</FormMessage>
 * ```
 */
function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  // Get form field state and message ID
  const { error, formMessageId } = useFormField()
  // Use custom message if provided, otherwise use validation error
  const body = error ? String(error?.message ?? "") : props.children

  // Don't render if there's no message to show
  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}  // For association with form control
      className={cn("text-destructive text-sm", className)}  // Error text style
      {...props}
    >
      {body}
    </p>
  )
}

// Export all form components and hooks
export {
  useFormField,  // Hook for form field state and utilities
  Form,  // Form provider component
  FormItem,  // Container for form fields
  FormLabel,  // Label for form controls
  FormControl,  // Wrapper for form controls
  FormDescription,  // Help text for form fields
  FormMessage,  // Error message display
  FormField,  // Form field controller
}
