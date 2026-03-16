import { z } from "zod"

export const signupSchema = z.object({

  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and _"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")

})


export const loginSchema = z.object({

  identifier: z
    .string()
    .min(1, "Enter username or email"),

  password: z
    .string()
    .min(1, "Password is required")

})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),
})

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
})
