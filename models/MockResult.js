

// import mongoose from "mongoose";

// const MockResultSchema = new mongoose.Schema({

//   // ================= USER =================
//   email: {
//     type: String,
//     required: true,
//     index: true
//   },
//   role: { type: String, default: "Student" },
//   collageName: { type: String },

//   // ================= 1️⃣ TECHNICAL =================
//   technicalAssessment: {
//     subject: String,
//     // standard: String,

//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     percentage: { type: Number, default: 0 },

//     details: [
//       {
//         questionId: Number,
//         questionText: String,
//         options: [String],
//         correctAnswer: String,
//         userAnswer: String,
//         isCorrect: Boolean,
//         _id: false
//       }
//     ]
//   },

//   // ================= 2️⃣ SITUATION =================
//   situationAssessment: {
//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     percentage: { type: Number, default: 0 },

//     details: [
//       {
//         questionId: Number,
//         questionText: String,
//         options: [String],
//         correctAnswer: String,
//         userAnswer: String,
//         isCorrect: Boolean,
//         _id: false
//       }
//     ]
//   },

//   // ================= 3️⃣ COMMUNICATION =================
//   voiceInterview: {
//     percentage: { type: Number, default: 0 },

//     transcripts: [
//       {
//         question: String,
//         answerTranscript: String,
//         _id: false
//       }
//     ]
//   },

//   // ================= 4️⃣ AI REPORTS =================
//   aiReport: {

//     technicalReport: String,
//     situationReport: String,
//     communicationReport: String,
//     overallSummary: String,

//     overallScore: { type: Number, default: 0 },

//     videoSuggestions: [String]  // AI suggested study topics
//   },

//   // ================= METADATA =================
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// export default mongoose.models.MockResult ||
// mongoose.model("MockResult", MockResultSchema);


// import mongoose from "mongoose";

// const MockResultSchema = new mongoose.Schema({

//   // ================= USER =================
//   email: {
//     type: String,
//     required: true,
//     index: true
//   },
//   role: { type: String, default: "Student" },
//   collageName: { type: String },

//   // ================= 1️⃣ TECHNICAL =================
//   technicalAssessment: {
//     subject: String,
//     standard: String,

//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     percentage: { type: Number, default: 0 },

//     details: [
//       {
//         questionId: Number,
//         questionText: String,
//         options: [String],
//         correctAnswer: String,
//         userAnswer: String,
//         isCorrect: Boolean,
//         _id: false
//       }
//     ]
//   },

//   // ================= 2️⃣ SITUATION =================
//   situationAssessment: {
//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     percentage: { type: Number, default: 0 },

//     details: [
//       {
//         questionId: Number,
//         questionText: String,
//         options: [String],
//         correctAnswer: String,
//         userAnswer: String,
//         isCorrect: Boolean,
//         _id: false
//       }
//     ]
//   },

//   // ================= 3️⃣ COMMUNICATION =================
//   voiceInterview: {
//     percentage: { type: Number, default: 0 },

//     transcripts: [
//       {
//         question: String,
//         answerTranscript: String,
//         _id: false
//       }
//     ]
//   },

//   // ================= 4️⃣ AI REPORTS =================
//   aiReport: {

//     technicalReport: String,
//     situationReport: String,
//     communicationReport: String,
//     overallSummary: String,

//     overallScore: { type: Number, default: 0 },

//     // videoSuggestions: [String]  // AI suggested study topics
//     videoSuggestions: [
//       {
//         title: { type: String },
//         url: { type: String },
//         description: { type: String }
//       }
//     ]
//   },

//   // ================= METADATA =================
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }

// });

// export default mongoose.models.MockResult ||
// mongoose.model("MockResult", MockResultSchema);


import mongoose from "mongoose";

const MockResultSchema = new mongoose.Schema({

  // ================= USER =================
  email: {
    type: String,
    required: true,
    index: true
  },
  role: { type: String, default: "Student" },
  collageName: { type: String },

  // ================= 1️⃣ TECHNICAL =================
  technicalAssessment: {
    subject: String,
    standard: String,

    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },

    details: [
      {
        questionId: Number,
        questionText: String,
        options: [String],
        correctAnswer: String,
        userAnswer: String,
        isCorrect: Boolean,
        _id: false
      }
    ]
  },

  // ================= 2️⃣ SITUATION =================
  situationAssessment: {
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },

    details: [
      {
        questionId: Number,
        questionText: String,
        options: [String],
        correctAnswer: String,
        userAnswer: String,
        isCorrect: Boolean,
        _id: false
      }
    ]
  },

  // ================= 3️⃣ COMMUNICATION =================
  voiceInterview: {
    percentage: { type: Number, default: 0 },

    transcripts: [
      {
        question: String,
        answerTranscript: String,
        _id: false
      }
    ]
  },
  aiReport: {

    technicalReport: String,
    situationReport: String,
    communicationReport: String,
    overallSummary: String,

    overallScore: { type: Number, default: 0 },

    videoSuggestions: [
      {
        title: { type: String },
        url: { type: String },
        description: { type: String },
         thumbnail: String,          // 🔥 store thumbnail permanently
      category: String,           // technical / interview / softskill
      watchTime: { type: Number, default: 0 },  // 🔥 seconds watched
      watched: { type: Boolean, default: false } // 🔥 completed or not
      }
    ]
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});
export default mongoose.models.MockResult ||
mongoose.model("MockResult", MockResultSchema);