// import mongoose from "mongoose";
// import Video from '../../models/Video';

// const MONGODB_URI = process.env.MONGODB_URI;

// let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default async function handler(req, res) {
//   try {
//     await dbConnect();

//     const { subject } = req.query;

//     if (!subject) {
//       return res.status(400).json({ error: "Subject required" });
//     }

//     // 4 technical
//     const technical = await Video.aggregate([
//       { $match: { subject, category: "technical" } },
//       { $sample: { size: 10 } }
//     ]);

//     // 1 interview
//     const interview = await Video.aggregate([
//       { $match: { category: "interview" } },
//       { $sample: { size: 1 } }
//     ]);

//     // 1 soft skill
//     const softskill = await Video.aggregate([
//       { $match: { category: "softskill" } },
//       { $sample: { size: 1 } }
//     ]);

//     res.json({
//       videos: [...technical, ...interview, ...softskill]
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// }


import mongoose from "mongoose";
import Video from "../../models/Video";
import MockResult from "../../models/MockResult";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await dbConnect();

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // 🔥 1. Get ALL tests sorted by latest
    const tests = await MockResult.find({ email })
      .sort({ createdAt: -1 })
      .select("technicalAssessment.subject createdAt");

    if (!tests.length) {
      return res.json({ groups: [] });
    }

    const groups = [];

    // 🔥 2. Loop through each test
    for (const test of tests) {
      const subject = test.technicalAssessment?.subject;
      if (!subject) continue;

      // 4 technical
      const technical = await Video.aggregate([
        { $match: { subject, category: "technical", isActive: true } },
        { $sample: { size: 3 } }
      ]);

      // 1 interview
      const interview = await Video.aggregate([
        { $match: { category: "interview", isActive: true } },
        { $sample: { size: 1 } }
      ]);

      // 1 soft skill
      const softskill = await Video.aggregate([
        { $match: { category: "softskill", isActive: true } },
        { $sample: { size: 1 } }
      ]);

      groups.push({
        testId: test._id,
        subject,
        date: test.createdAt,
        videos: [...technical, ...interview, ...softskill]
      });
    }

    res.json({ groups });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
