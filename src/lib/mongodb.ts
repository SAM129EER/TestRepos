import mongoose from "mongoose"

type MongooseGlobal = typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const g = globalThis as MongooseGlobal

if (!g.mongoose) {
  g.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables.")
  }

  if (g.mongoose!.conn) return g.mongoose!.conn

  if (!g.mongoose!.promise) {
    g.mongoose!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  g.mongoose!.conn = await g.mongoose!.promise
  return g.mongoose!.conn
}

