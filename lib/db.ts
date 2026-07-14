import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Copy .env.example to .env and set it."
  );
}


interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cache.conn;
  }

  if (!cache.promise) {
    console.log("⏳ Connecting to MongoDB...");

    cache.promise = mongoose
      .connect(MONGODB_URI as string, {
        bufferCommands: false,
      })
      .then((m) => {
        console.log("✅ MongoDB Connected Successfully");
        console.log("📌 Database:", m.connection.db?.databaseName);
        console.log("🌐 Host:", m.connection.host);
        return m;
      });
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    console.log("❌ MongoDB Connection Failed");
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}

export default connectDB;
