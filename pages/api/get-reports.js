import mongoose from "mongoose";
import MockResult from "../../models/MockResult";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email, id } = req.query;

    if (id) {
      const report = await MockResult.findById(id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      return res.json({ success: true, report });
    }

    if (email) {
      const reports = await MockResult.find({ email }).sort({ createdAt: -1 });
      return res.json({ success: true, reports });
    }

    const all = await MockResult.find().sort({ createdAt: -1 });
    return res.json({ success: true, reports: all });

  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
