import { NextResponse } from "next/server"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"
import { PendingSignup } from "@/models/PendingSignup"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Missing token." }, { status: 400 })
    }

    await connectToDatabase()

    // First: verify pending signup and create the user
    const pending = await PendingSignup.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    })

    if (!pending) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 })
    }

    const existing = await User.findOne({
      $or: [{ email: pending.email }, { username: pending.username }],
    }).lean()

    if (existing) {
      // If user already exists, treat as verified successfully and delete pending record
      await PendingSignup.deleteOne({ _id: pending._id })
      return NextResponse.json({ success: true })
    }

    await User.create({
      fullName: pending.fullName,
      username: pending.username,
      email: pending.email,
      passwordHash: pending.passwordHash,
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    })

    await PendingSignup.deleteOne({ _id: pending._id })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}

