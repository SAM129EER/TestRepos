"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("Verifying your email...")

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Missing verification token.")
        return
      }

      const res = await fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null
        setStatus("error")
        setMessage(err?.error ?? "Verification failed.")
        return
      }

      setStatus("success")
      setMessage("Your email has been verified. You can now log in.")
    }

    run()
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            {status === "success" ? "Email verified" : status === "error" ? "Verification error" : "Verifying"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {status === "success" && (
            <Button onClick={() => router.push("/auth/login")}>
              Go to login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

