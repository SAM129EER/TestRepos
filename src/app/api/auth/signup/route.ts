import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import crypto from "crypto";
import { buildVerificationLink, sendEmail } from "@/lib/email";
import { PendingSignup } from "@/models/PendingSignup";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName =
      typeof body?.fullName === "string" ? body.fullName.trim() : "";
    const username =
      typeof body?.username === "string" ? body.username.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!fullName || !username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({
      $or: [{ email }, { username }],
    }).lean();

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    // Replace any previous pending signup for same email/username
    await PendingSignup.deleteMany({ $or: [{ email }, { username }] });

    await PendingSignup.create({
      fullName,
      username,
      email,
      passwordHash,
      verificationToken,
      verificationTokenExpires,
    });

    const verifyLink = buildVerificationLink(verificationToken);

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <p>Hi ${fullName},</p>
        <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
        <p><a href="${verifyLink}">Verify Email</a></p>
        <p>If you did not create this account, you can ignore this email.</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
