import React, { useState } from 'react'
// Import shadcn/ui form components
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Import React Hook Form types and utilities
import { Controller, FieldValues, Path, Control } from "react-hook-form";
// Import icons for password visibility toggle
import { Eye, EyeOff } from "lucide-react";

/**
 * Props for the FormField component
 * @template T - The type of the form values
 * 
 * @property {Control<T>} control - React Hook Form control object
 * @property {Path<T>} name - The name/path of the field in the form
 * @property {string} [placeholder] - Optional placeholder text for the input
 * @property {'text' | 'email' | 'password' | 'file'} [type='text'] - The type of input
 * @property {boolean} [aria-required] - Indicates if the field is required for accessibility
 */
interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file';
    'aria-required'?: boolean;
}

/**
 * A reusable form input field component with built-in validation and password visibility toggle
 * 
 * @template T - The type of the form values
 * @param {FormFieldProps<T>} props - Component props
 * @returns {JSX.Element} A form field with optional password visibility toggle
 * 
 * Features:
 * - Integrates with React Hook Form for form state management
 * - Supports text, email, password, and file input types
 * - Includes password visibility toggle for password fields
 * - Provides consistent styling and error handling
 */
const FormField = <T extends FieldValues>({ 
    control, 
    name, 
    placeholder, 
    type = "text",
    'aria-required': ariaRequired
}: FormFieldProps<T>) => {
    // State to manage password visibility toggle
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <div className="relative w-full">
                            <Input
                                className={`input pr-10 w-full ${error ? 'border-red-500' : ''}`}
                                placeholder={placeholder}
                                type={isPassword ? (showPassword ? "text" : "password") : type}
                                aria-required={ariaRequired}
                                aria-invalid={!!error}
                                aria-describedby={error ? `${name}-error` : undefined}
                                {...field}
                            />
                            
                            {/* Password visibility toggle (only for password fields) */}
                            {isPassword && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1} // Prevent focusing on the button for better keyboard navigation
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} aria-hidden="true" />
                                    ) : (
                                        <Eye size={18} aria-hidden="true" />
                                    )}
                                </button>
                            )}
                            
                            {/* Error message (displayed by FormMessage) */}
                            <FormMessage id={`${name}-error`} className="text-red-500 text-sm mt-1" />
                        </div>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};

export default FormField;
