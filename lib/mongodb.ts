import mongoose, { Connection } from 'mongoose'

// Extend the global object type
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Type assertion to ensure MONGODB_URI is a string after the check
const mongoUri: string = MONGODB_URI

let cached = (global.mongoose ??= { conn: null, promise: null })

async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose.connection
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB 