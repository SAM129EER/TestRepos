import { NextResponse } from "next/server"
import crypto from "crypto"

import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/models/User"
import { buildResetPasswordLink, sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) {
      // Avoid leaking whether the email exists
      return NextResponse.json({ success: true })
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex")
    const resetPasswordTokenExpires = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes

    user.resetPasswordToken = resetPasswordToken
    user.resetPasswordTokenExpires = resetPasswordTokenExpires
    await user.save()

    const resetLink = buildResetPasswordLink(resetPasswordToken)

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hi ${user.fullName},</p>
        <p>You requested to reset your password. Click the link below to choose a new password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}

