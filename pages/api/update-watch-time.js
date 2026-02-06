import MockResult from "../../models/MockResult";
import connectDb from "../../middleware/dbConnect";

const handler = async (req, res) => {
  const { reportId, videoId, watchTime, duration } = req.body;

  await MockResult.updateOne(
    {
      _id: reportId,
      "aiReport.videoSuggestions._id": videoId
    },
    {
      $max: {
        "aiReport.videoSuggestions.$.watchTime": watchTime
      },
      $set: {
        "aiReport.videoSuggestions.$.duration": duration
      }
    }
  );

  res.json({ success: true });
};

export default connectDb(handler);
