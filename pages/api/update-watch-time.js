import connectDb from "../../middleware/dbConnect";
import MockResult from "../../models/MockResult";

const handler = async (req, res) => {
  const { reportId, videoId, watchTime } = req.body;

  await MockResult.updateOne(
    { _id: reportId, "aiReport.videoSuggestions._id": videoId },
    {
      $set: {
        "aiReport.videoSuggestions.$.watchTime": watchTime,
      },
    }
  );

  res.json({ success: true });
};

export default connectDb(handler);
