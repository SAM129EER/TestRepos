import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const isSignup = from === "signup"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="mt-2 text-muted-foreground">
          {isSignup
            ? "We sent you a verification link. Your account will be created after you verify your email."
            : "We sent you a link. Please check your email."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className={buttonVariants({ variant: "default" })} href="/auth/login">
            Back to login
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} href="/auth/resend-verification">
            Resend verification email
          </Link>
        </div>
      </div>
    </main>
  )
}

