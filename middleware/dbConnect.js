// middleware/dbConnect.js
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = (handler) => async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not defined");
    }

    if (cached.conn) {
      return handler(req, res);
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGODB_URI, {
        bufferCommands: false
      });
    }

    cached.conn = await cached.promise;

    console.log("MongoDB connected");

    return handler(req, res);

  } catch (error) {
    console.error("MongoDB connection error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
};

export default connectDb;