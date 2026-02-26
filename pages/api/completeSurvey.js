// import User from "../../models/User";
// import connectDb from "../../middleware/dbConnect";
// import jwt from "jsonwebtoken";

// export default connectDb(async function handler(req, res) {

//   // ✅ Allow only POST
//   if (req.method !== "POST") {
//     return res.status(405).json({ success: false, error: "Method not allowed" });
//   }

//   try {
//     // ✅ Get token
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ success: false, error: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Update user
//     await User.findByIdAndUpdate(decoded.id, {
//       baselineSurveyCompleted: true,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Survey marked completed",
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(401).json({
//       success: false,
//       error: "Invalid or expired token",
//     });
//   }
// });

import connectDb from "@/middleware/dbConnect";
import BaselineSurvey from "@/models/BaselineSurvey";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

    // check already submitted
    const existing = await BaselineSurvey.findOne({ userId });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Survey already submitted",
      });
    }

    // create survey
    const survey = await BaselineSurvey.create({
      userId,
      ...req.body,
    });

    // update user
    await User.findByIdAndUpdate(userId, {
      baselineSurveyCompleted: true,
    });

    res.status(200).json({
      success: true,
      message: "Survey submitted successfully",
      survey,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}