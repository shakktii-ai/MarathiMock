import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: ["PCB", "AAO", "Communication"],
      required: true,
    },

    category: {
      type: String,
      enum: ["technical", "interview", "softskill"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    thumbnail: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Video ||
  mongoose.model("Video", VideoSchema);
