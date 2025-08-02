"use client"  // Mark as a Client Component in Next.js

// Import form validation and schema utilities
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRef, useEffect } from "react"

// Import UI components
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import FormField from "@/components/FormField"

// Import Next.js components
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Import notification library
import { toast } from "sonner"

// Import Firebase authentication functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"

// Import authentication actions
import { signIn, signUp } from "@/lib/actions/auth.action"

/**
 * Schema for user sign-up form validation
 * - name: Minimum 3 characters
 * - email: Must be a valid email from allowed domains
 * - password: Minimum 8 characters, no spaces
 * - confirmPassword: Must match password
 */
const signUpSchema = z.object({
  name: z.string().min(3, { message: "Name must have 3 or more characters" }),
  email: z.string()
    .email({ message: "Invalid Email format" })
    .refine(email => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      if (!domain) return false;
      // Only allow specific email domains for sign-up
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
      return validDomains.some(validDomain => domain.endsWith(validDomain));
    }, { message: "Invalid Email Format" }),
  password: z.string()
    .min(8, { message: "Password must have 8 or more characters" })
    .refine((val) => !/\s/.test(val), { message: "Password must not contain spaces" }),
  confirmPassword: z.string().min(8, { message: "Password must have 8 or more characters" }),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
)

/**
 * Schema for user sign-in form validation
 * - email: Must be a valid email from allowed domains
 * - password: Minimum 8 characters, no spaces
 * - name: Optional field (not used in sign-in but kept for form consistency)
 */
const signInSchema = z.object({
  name: z.string().optional(),  // Not used in sign-in but kept for form consistency
  email: z.string()
    .email({ message: "Invalid Email format" })
    .refine(email => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      if (!domain) return false;
      // Only allow specific email domains for sign-in
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
      return validDomains.some(validDomain => domain.endsWith(validDomain));
    }, { message: "Invalid Email Format" }),
  password: z.string()
    .min(8, { message: "Password must have 8 or more characters" })
    .refine((val) => !/\s/.test(val), { message: "Password must not contain spaces" }),
})

/**
 * AuthForm Component
 * 
 * Handles both sign-in and sign-up forms with validation and submission.
 * Uses React Hook Form with Zod validation for form handling.
 * 
 * @param {Object} props - Component props
 * @param {'sign-in'|'sign-up'} props.type - Determines which form to display
 */
const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  // Initialize hooks
  const router = useRouter()
  const isSignIn = type === 'sign-in'

  // Use the appropriate schema based on form type
  const formSchema = isSignIn ? signInSchema : signUpSchema

  // Initialize form with validation using react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',  // Validate on every change
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as any,  // Type assertion to handle dynamic schema
  })

  // Get current form errors and track previous errors for comparison
  const { errors } = form.formState;
  const prevErrorsRef = useRef(errors);

  /**
   * Effect to handle form validation errors and show toast notifications
   * Compares current errors with previous errors to only show new errors
   */
  useEffect(() => {
    // Check for new errors that weren't present before
    Object.entries(errors).forEach(([field, error]) => {
      // Only show error if it's new (wasn't in previous errors)
      if (error?.message && !prevErrorsRef.current[field as keyof typeof errors]?.message) {
        let friendlyMessage = error.message;
        
        // Convert technical error messages to more user-friendly ones
        if (field === 'email') {
          friendlyMessage = 'Please enter a valid email address from a supported provider';
        } else if (field === 'name') {
          friendlyMessage = 'Name must be at least 3 characters long';
        } else if (field === 'password') {
          friendlyMessage = 'Password must be at least 8 characters and contain no spaces';
        } else if (field === 'confirmPassword') {
          friendlyMessage = 'Passwords do not match';
        }
        
        // Show error toast notification
        toast.error(friendlyMessage);
      }
    });
    
    // Update the previous errors reference for the next render
    prevErrorsRef.current = { ...errors };
  }, [errors]);  // Re-run when errors change

  /**
   * Handles form submission for both sign-in and sign-up
   * @param {Object} values - Form values validated against the schema
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        // Handle sign-up flow
        const { name, email, password, confirmPassword } = values as z.infer<typeof signUpSchema>

        // Double-check password match (should be handled by schema, but good to be thorough)
        if (password !== confirmPassword) {
          toast.error("Passwords do not match")
          return
        }

        // 1. Create user in Firebase Authentication
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

        // 2. Create user in our database
        const result = await signUp({
          uid: userCredentials.user.uid,  // Firebase Auth UID
          name: name!,
          email,
          password,  // Note: In production, ensure proper password hashing is done server-side
        })

        // Check if user creation in database was successful
        if (!result?.success) {
          toast.error(result?.message || 'Failed to create account')
          return
        }

        // Success! Redirect to sign-in page
        toast.success('Account created successfully!')
        router.push('/sign-in')
      } else {
        // Handle sign-in flow
        const { email, password } = values

        // 1. Sign in with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // 2. Get ID token for session management
        const idToken = await userCredential.user.getIdToken()
        if (!idToken) {
          throw new Error('Failed to get ID token')
        }

        // 3. Set up session with our backend
        await signIn({ email, idToken })

        // Success! Redirect to home page
        toast.success('Logged in successfully!')
        router.push('/')
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      
      // Handle specific Firebase authentication errors
      const errorMessage = error?.message?.toLowerCase() || ""

      if (errorMessage.includes("auth/email-already-in-use")) {
        toast.error("This email is already registered. Please sign in.")
      } else if (errorMessage.includes("auth/invalid-email")) {
        toast.error("Please enter a valid email address")
      } else if (errorMessage.includes("auth/user-not-found")) {
        toast.error("No account found with this email. Please sign up first.")
      } else if (errorMessage.includes("auth/invalid-credential") || errorMessage.includes("auth/wrong-password")) {
        toast.error("Invalid email or password")
      } else {
        // Generic error for any other issues
        toast.error(`Authentication failed: ${error.message || 'Please try again'}`)
      }
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      {/* Main card container */}
      <div className="flex flex-col gap-6 card py-14 px-10">
        {/* Logo and title */}
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image
            src="/logo.png"
            alt="Intervia Logo"
            height={32}
            width={38}
            priority  // Preload important above-the-fold image
          />
          <h1 className="text-primary-100 text-2xl font-bold">Intervia</h1>
        </div>
        
        {/* Subtitle */}
        <h2 className="text-center text-lg text-gray-600">Practice mock interviews with AI</h2>

        {/* Form */}
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="w-full space-y-6 mt-4 form"
            aria-label={isSignIn ? "Sign in form" : "Sign up form"}
          >
            {/* Name field - only shown for sign-up */}
            {!isSignIn && (
              <FormField 
                control={form.control} 
                name="name" 
                placeholder="Full Name"
                aria-required={true}
              />
            )}

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              placeholder="Email Address"
              type="email"
              aria-required={true}
            />

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              placeholder="Password"
              type="password"
              aria-required={true}
            />

            {/* Confirm Password field - only shown for sign-up */}
            {!isSignIn && (
              <FormField
                control={form.control}
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                aria-required={true}
              />
            )}

            {/* Submit button */}
            <Button 
              className="btn w-full py-6 text-lg font-semibold" 
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting 
                ? 'Processing...' 
                : isSignIn 
                  ? "Sign In" 
                  : "Create an Account"
              }
            </Button>
          </form>
        </Form>

        {/* Toggle between sign-in and sign-up */}
        <p className="text-center text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="text-primary-500 ml-1 hover:underline font-medium"
            aria-label={isSignIn ? "Go to sign up page" : "Go to sign in page"}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
