"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resendVerificationSchema } from "@/lib/validation"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"

type ResendVerificationForm = z.infer<typeof resendVerificationSchema>

export default function ResendVerificationPage() {
  const [rootError, setRootError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationForm>({
    resolver: zodResolver(resendVerificationSchema),
  })

  const onSubmit = async (data: ResendVerificationForm) => {
    setRootError(null)
    setSuccess(null)

    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { error?: string } | null
      setRootError(err?.error ?? "Something went wrong")
      return
    }

    setSuccess("If your account exists and isn’t verified, we sent you a verification link.")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Resend verification</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a new verification link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {rootError && <FieldError>{rootError}</FieldError>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                placeholder="email@example.com"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send verification link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

