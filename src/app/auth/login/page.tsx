"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validation"
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

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [rootError, setRootError] = useState<string | null>(null)
  const [showResendVerify, setShowResendVerify] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setRootError(null)
    setShowResendVerify(false)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null
      const msg = err?.error ?? "Login failed"
      setRootError(msg)
      if (msg.toLowerCase().includes("verify your email")) {
        setShowResendVerify(true)
      }
      return
    }

    router.push("/auth/success?from=login")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Access your account to continue the conversation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {rootError && <FieldError>{rootError}</FieldError>}
            {showResendVerify && (
              <div className="text-sm text-muted-foreground">
                <Link
                  href="/auth/resend-verification"
                  className="text-primary hover:underline"
                >
                  Resend verification email
                </Link>
              </div>
            )}

            {/* Identifier */}

            <Field>
              <FieldLabel>Email or Username</FieldLabel>

              <Input
                {...register("identifier")}
                placeholder="Enter email or username"
                autoComplete="username"
                aria-invalid={!!errors.identifier}
              />

              {errors.identifier && (
                <FieldError>
                  {errors.identifier.message}
                </FieldError>
              )}
            </Field>

            {/* Password */}

            <Field>
              <FieldLabel>Password</FieldLabel>

              <Input
                type="password"
                placeholder="password"
                {...register("password")}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
              />

              {errors.password && (
                <FieldError>
                  {errors.password.message}
                </FieldError>
              )}
            </Field>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          <span className="mr-1">Don&apos;t have an account?</span>
          <Link
            href="/auth/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}