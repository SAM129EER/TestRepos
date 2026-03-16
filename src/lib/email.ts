import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const appUrl = process.env.APP_URL ?? "http://localhost:3000";

if (!resendApiKey) {
  console.warn("RESEND_API_KEY is not set. Email sending will be disabled.");
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: SendEmailOptions) {
  if (!resend) {
    return;
  }

  await resend.emails.send({
    from: "Auth Demo <onboarding@resend.dev>",
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export function buildVerificationLink(token: string) {
  return `${appUrl}/auth/verify?token=${encodeURIComponent(token)}`;
}

export function buildResetPasswordLink(token: string) {
  return `${appUrl}/auth/reset-password?token=${encodeURIComponent(token)}`;
}
