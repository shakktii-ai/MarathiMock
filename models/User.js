const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
    email: { type: String, sparse: true },
    DOB: { type: String, default: "" },
    address: { type: String, default: "" },
    mobileNo: { type: String, default: "" ,unique:true},
    education: { type: String, default: "" },
    collageName: { type: String, default: "" },
    password: { type: String, default: "" },
    profileImg: { type: String, default: "" },
    no_of_interviews: { type: Number, default: 0 },
    no_of_interviews_completed: { type: Number, default: 0 },
    permanentLoginToken: { type: String, unique: true, sparse: true },
  no_of_tests: { type: Number, required: true, default: 2 },
  baselineSurveyCompleted: {type: Boolean,default: false },
  department:{type:String,default:'y4d'}
}, { timestamps: true });


export default mongoose.models.User || mongoose.model("User", UserSchema);
