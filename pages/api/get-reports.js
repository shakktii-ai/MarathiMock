import MockResult from "../../models/MockResult";
import connectDb from "../../middleware/dbConnect";

const handler = async (req, res) => {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { email, id } = req.query;

    if (id) {
      const report = await MockResult.findById(id).lean();

      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      return res.json({ success: true, report });
    }

    if (email) {
      const reports = await MockResult.find({ email })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({ success: true, reports });
    }

    const all = await MockResult.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, reports: all });

  } catch (err) {
    console.error("Fetch error:", err);

    return res.status(500).json({ error: "Server error" });
  }
};

export default connectDb(handler);