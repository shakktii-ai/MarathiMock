import mongoose from "mongoose";

const BaselineSurveySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one time submission
    },
email: { type: String, sparse: true },
    name:{type: String,required:true},
    phone: {type: String,required:true},
    age: {type: String,required:true},
    education: {type: String,required:true},

    interview:{type: String,required:true},
    working: {type: String,required:true},
    smartphone: {type: String,required:true},

    comfort: {type: Number,required:true},

    language: {type: String,required:true},
    otherLanguage: {type: String,required:true},
  },
  { timestamps: true }
);

export default mongoose.models.BaselineSurvey ||
  mongoose.model("BaselineSurvey", BaselineSurveySchema);