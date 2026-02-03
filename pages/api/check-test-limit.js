import connectDb from "@/middleware/dbConnect";// or your db connect logic
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDb();

  const { email } = req.query;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({
    remainingTests: user.no_of_tests
  });
}
