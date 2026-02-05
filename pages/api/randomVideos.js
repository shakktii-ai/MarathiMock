import Video from "../../models/Video";
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
      .select("technicalAssessment.subject createdAt");

    if (!tests.length) {
      return res.json({ groups: [] });
    }

    const groups = [];

    for (const test of tests) {
      const subject = test.technicalAssessment?.subject;
      if (!subject) continue;

      const technical = await Video.aggregate([
        { $match: { subject, category: "technical", isActive: true } },
        { $sample: { size: 3 } }
      ]);

      const interview = await Video.aggregate([
        { $match: { category: "interview", isActive: true } },
        { $sample: { size: 1 } }
      ]);

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
};

export default connectDb(handler);
