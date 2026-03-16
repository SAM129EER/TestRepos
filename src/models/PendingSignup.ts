import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose"

const pendingSignupSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    verificationToken: { type: String, required: true, index: true, unique: true },
    verificationTokenExpires: { type: Date, required: true, index: true },
  },
  { timestamps: true }
)

// Optional: automatically delete expired docs (Mongo TTL index)
pendingSignupSchema.index({ verificationTokenExpires: 1 }, { expireAfterSeconds: 0 })

export type PendingSignupDoc = InferSchemaType<typeof pendingSignupSchema>

export const PendingSignup: Model<PendingSignupDoc> =
  (mongoose.models.PendingSignup as Model<PendingSignupDoc>) ||
  mongoose.model<PendingSignupDoc>("PendingSignup", pendingSignupSchema)

