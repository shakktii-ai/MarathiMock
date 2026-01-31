// import mongoose from 'mongoose';

// const MockResultSchema = new mongoose.Schema({
//   // --- User Identity ---
//   email: { 
//     type: String, 
//     required: true, 
//     index: true 
//   },
//   role: { type: String, default: 'Student' },
//   collageName: { type: String },

//   // --- 1. Technical Assessment Data ---
//   technicalAssessment: {
//     subject: { type: String },
//     standard: { type: String },
//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     // Storing details inline
//     details: [
//       {
//         questionId: Number,
//         questionText: String,
//         options: [String], // Array of strings
//         correctAnswer: String,
//         userAnswer: String,
//         isCorrect: Boolean,
//         _id: false // Prevents creating a unique ID for every single answer (saves space)
//       }
//     ]
//   },

//   // --- 2. Voice Interview Data ---
//   voiceInterview: {
//     aiFeedback: { type: String },
//     // Storing transcripts inline
//     transcripts: [
//       {
//         question: String,
//         answerTranscript: String,
//         _id: false
//       }
//     ]
//   },

//   // --- 3. Situation Aptitude Data ---
//   situationAssessment: {
//     score: { type: Number, default: 0 },
//     totalQuestions: { type: Number, default: 0 },
//     // Storing details inline
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

//   // --- 4. AI Generated Report ---
//   aiReport: {
//     summary: { type: String },
//     strengths: [String],           // Array of strings
//     areasForImprovement: [String], // Array of strings
//     careerRoadmap: { type: String },
//     fullReportMarkdown: { type: String }
//   },

//   // --- Metadata ---
//   createdAt: { type: Date, default: Date.now }
// });

// // Export only ONE model
// export default mongoose.models.MockResult || mongoose.model('MockResult', MockResultSchema);


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

  // ================= 4️⃣ AI REPORTS =================
  aiReport: {

    technicalReport: String,
    situationReport: String,
    communicationReport: String,
    overallSummary: String,

    overallScore: { type: Number, default: 0 },

    videoSuggestions: [String]  // AI suggested study topics
  },

  // ================= METADATA =================
  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.MockResult ||
mongoose.model("MockResult", MockResultSchema);
