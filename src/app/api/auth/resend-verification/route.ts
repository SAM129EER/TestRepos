import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { buildVerificationLink, sendEmail } from "@/lib/email";
import { PendingSignup } from "@/models/PendingSignup";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (user) {
      if (user.emailVerified) {
        return NextResponse.json({ success: true });
      }
      // If a user exists but isn't verified (legacy data), keep using user verification fields
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 1000 * 60 * 60 * 24,
      ); // 24 hours

      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      const verifyLink = buildVerificationLink(verificationToken);

      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
          <p>Hi ${user.fullName},</p>
          <p>Click the link below to verify your email:</p>
          <p><a href="${verifyLink}">Verify Email</a></p>
        `,
      });

      return NextResponse.json({ success: true });
    }

    const pending = await PendingSignup.findOne({ email });
    if (!pending) {
      // Avoid leaking whether the email exists
      return NextResponse.json({ success: true });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    pending.verificationToken = verificationToken;
    pending.verificationTokenExpires = verificationTokenExpires;
    await pending.save();

    const verifyLink = buildVerificationLink(verificationToken);

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hi ${pending.fullName},</p>
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyLink}">Verify Email</a></p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
