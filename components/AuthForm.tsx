"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "@/components/FormField"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"

const signUpSchema = z.object({
  name: z.string().min(3, { message: "Name must have 3 or more characters" }),
  email: z.string()
    .email({ message: "Invalid Email format" })
    .refine(email => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      if (!domain) return false;
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
      return validDomains.some(validDomain => domain.endsWith(validDomain));
    }, { message: "Invalid Email Format" }),
  password: z.string().min(8, { message: "Password must have 8 or more characters" }).refine((val) => !/\s/.test(val), { message: "Password must not contain spaces" }),
  confirmPassword: z.string().min(8, { message: "Password must have 8 or more characters" }),
})

const signInSchema = z.object({
  name: z.string().optional(),
  email: z.string()
    .email({ message: "Invalid Email format" })
    .refine(email => {
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const domain = parts[1];
      if (!domain) return false;
      const validDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'];
      return validDomains.some(validDomain => domain.endsWith(validDomain));
    }, { message: "Invalid Email Format" }),
  password: z.string().min(8, { message: "Password must have 8 or more characters" }).refine((val) => !/\s/.test(val), { message: "Password must not contain spaces" }),
})

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const isSignIn = type === 'sign-in'

  const formSchema = isSignIn ? signInSchema : signUpSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } as any,
  })

  // Handle form validation changes
  const { errors } = form.formState;
  const prevErrorsRef = useRef(errors);

  useEffect(() => {
    // Check for new errors
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message && !prevErrorsRef.current[field as keyof typeof errors]?.message) {
        let friendlyMessage = error.message;
        
        if (field === 'email') {
          friendlyMessage = 'Invalid Email Format';
        } else if (field === 'name') {
          friendlyMessage = 'Name must be at least 3 characters';
        } else if (field === 'password') {
          friendlyMessage = 'Password must be at least 8 characters and contain no spaces';
        } else if (field === 'confirmPassword') {
          friendlyMessage = 'Passwords do not match';
        }
        
        toast.error(friendlyMessage);
      }
    });
    
    // Update previous errors
    prevErrorsRef.current = { ...errors };
  }, [errors]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        const { name, email, password, confirmPassword } = values as z.infer<typeof signUpSchema>

        if (password !== confirmPassword) {
          toast.error("Passwords do not match")
          return
        }

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if (!result?.success) {
          toast.error(result?.message)
          return
        }

        toast.success('Account created successfully!')
        router.push('/sign-in')
      } else {
        const { email, password } = values

        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        const idToken = await userCredential.user.getIdToken()
        if (!idToken) {
          toast.error('Sign in Failed')
          return
        }

        await signIn({ email, idToken })

        toast.success('Logged In successfully!')
        router.push('/')
      }
    } catch (error: any) {
      const errorMessage = error?.message?.toLowerCase() || ""

      if (errorMessage.includes("auth/email-already-in-use")) {
        toast.error("Email already in Use")
      } else if (errorMessage.includes("auth/invalid-email")) {
        toast.error("Invalid Email format")
      } else if (errorMessage.includes("auth/user-not-found")) {
        toast.error("Create an account to Sign in")
      } else if (errorMessage.includes("auth/invalid-credential") || errorMessage.includes("auth/wrong-password")) {
        toast.error("Invalid email or password")
      } else {
        toast.error(`There was an error: ${error.message}`)
      }
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            height={32}
            width={38} />
          <h2 className="text-primary-100">Intervia</h2>
        </div>
        <h3 className="text-center">Practice mock interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField control={form.control} name="name" placeholder="Name" />
            )}

            <FormField
              control={form.control}
              name="email"
              placeholder="Email Address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              placeholder="Password"
              type="password"
            />

            {!isSignIn && (
              <FormField
                control={form.control}
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
              />
            )}

            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
