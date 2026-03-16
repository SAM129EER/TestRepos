import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-background to-muted px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Fullstack Chat App
          </h1>
          <p className="text-muted-foreground">
            Login or create an account to start chatting in real time.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link
            className={buttonVariants({ variant: "outline", size: "lg" })}
            href="/auth/login"
          >
            Login
          </Link>
          <Link
            className={buttonVariants({ variant: "default", size: "lg" })}
            href="/auth/signin"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </main>
  )
}
