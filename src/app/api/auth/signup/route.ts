import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : ""
    const username = typeof body?.username === "string" ? body.username.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!fullName || !username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }

    await connectToDatabase()

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    }).lean()

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already exists." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ fullName, username, email, passwordHash })

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          fullName: user.fullName,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}

