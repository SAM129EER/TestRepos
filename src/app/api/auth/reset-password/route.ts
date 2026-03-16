import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const token = typeof body?.token === "string" ? body.token.trim() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password." }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    user.passwordHash = passwordHash
    user.resetPasswordToken = null
    user.resetPasswordTokenExpires = null
    await user.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}

