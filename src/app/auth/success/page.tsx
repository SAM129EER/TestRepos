import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default async function AuthSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams
  const action = from === "signup" ? "signed up" : "logged in"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Success</h1>
        <p className="mt-2 text-muted-foreground">
          You have {action} successfully.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className={buttonVariants({ variant: "default" })} href="/">
            Go home
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} href="/auth/login">
            Back to login
          </Link>
        </div>
      </div>
    </main>
  )
}

