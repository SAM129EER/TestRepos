import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const identifier = typeof body?.identifier === "string" ? body.identifier.trim() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing credentials." }, { status: 400 })
    }

    await connectToDatabase()

    const isEmail = identifier.includes("@")
    const user = await User.findOne(isEmail ? { email: identifier.toLowerCase() } : { username: identifier })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    })
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}

