import MockResult from "../../models/MockResult";
import connectDb from "../../middleware/dbConnect";

const handler = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const tests = await MockResult.find({ email })
      .sort({ createdAt: -1 })
      .select("technicalAssessment.subject aiReport.videoSuggestions createdAt");

    res.json({ tests });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export default connectDb(handler);
