import connectDb from "@/middleware/dbConnect";
import BaselineSurvey from "@/models/BaselineSurvey";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "GET") {
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

    // verify admin token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const surveys = await BaselineSurvey.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      surveys,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}