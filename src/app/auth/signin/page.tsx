"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/validation"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import Link from "next/link"

import {
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"
import { useRouter } from "next/navigation"

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [rootError, setRootError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupForm) => {
    setRootError(null)
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null
      setRootError(err?.error ?? "Signup failed")
      return
    }

    router.push("/auth/success?from=signup")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join the chat app and start messaging instantly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {rootError && <FieldError>{rootError}</FieldError>}

            {/* Full Name */}

            <Field>
              <FieldLabel>Full Name</FieldLabel>

              <Input
                {...register("fullName")}
                placeholder="John Doe"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
              />

              {errors.fullName && (
                <FieldError>
                  {errors.fullName.message}
                </FieldError>
              )}
            </Field>

            {/* Username */}

            <Field>
              <FieldLabel>Username</FieldLabel>

              <Input
                {...register("username")}
                placeholder="john123"
                autoComplete="username"
                aria-invalid={!!errors.username}
              />

              {errors.username && (
                <FieldError>
                  {errors.username.message}
                </FieldError>
              )}
            </Field>

            {/* Email */}

            <Field>
              <FieldLabel>Email</FieldLabel>

              <Input
                {...register("email")}
                placeholder="email@example.com"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />

              {errors.email && (
                <FieldError>
                  {errors.email.message}
                </FieldError>
              )}
            </Field>

            {/* Password */}

            <Field>
              <FieldLabel>Password</FieldLabel>

              <Input
                type="password"
                {...register("password")}
                placeholder="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
              />

              {errors.password && (
                <FieldError>
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          <span className="mr-1">Already have an account?</span>
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}