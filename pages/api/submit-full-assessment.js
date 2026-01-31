// // import mongoose from 'mongoose';
// // import MockResult from '@/models/MockResult'; 

// // // --- DATABASE CONNECTION ---
// // const MONGODB_URI = process.env.MONGODB_URI;

// // if (!MONGODB_URI) {
// //   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// // }

// // let cached = global.mongoose;
// // if (!cached) {
// //   cached = global.mongoose = { conn: null, promise: null };
// // }

// // async function dbConnect() {
// //   if (cached.conn) return cached.conn;
// //   if (!cached.promise) {
// //     const opts = {
// //       bufferCommands: false,
// //       maxPoolSize: 5,
// //       serverSelectionTimeoutMS: 10000,
// //     };
// //     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
// //   }
// //   cached.conn = await cached.promise;
// //   return cached.conn;
// // }

// // export default async function handler(req, res) {
  
// //   // ==========================================
// //   // 1. GET REQUEST: Fetch Reports
// //   // ==========================================
// //   if (req.method === 'GET') {
// //     try {
// //       await dbConnect();
// //       const { email, id } = req.query;

// //       // Scenario A: Fetch Single Result by ID
// //       if (id) {
// //         if (!mongoose.Types.ObjectId.isValid(id)) {
// //             return res.status(400).json({ error: "Invalid Report ID" });
// //         }
// //         const report = await MockResult.findById(id);
// //         if (!report) return res.status(404).json({ error: "Report not found" });
// //         return res.status(200).json({ success: true, report });
// //       }

// //       // Scenario B: Fetch All Reports by Email
// //       if (email) {
// //         const reports = await MockResult.find({ email }).sort({ createdAt: -1 });
// //         return res.status(200).json({ success: true, count: reports.length, reports });
// //       }

// //       // Scenario C: Return EVERYTHING (No ID or Email provided)
// //       // Useful for checking all data in Postman
// //       const allReports = await MockResult.find({}).sort({ createdAt: -1 });
// //       return res.status(200).json({ success: true, count: allReports.length, reports: allReports });

// //     } catch (error) {
// //       console.error("Fetch Error:", error);
// //       return res.status(500).json({ error: "Failed to fetch data" });
// //     }
// //   }

// //   // ==========================================
// //   // 2. POST REQUEST: Submit & Generate Report
// //   // ==========================================
// //   else if (req.method === 'POST') {
// //     try {
// //       await dbConnect();

// //       const { email, userInfo, masterData } = req.body;
// //       const apiKey = process.env.OPENAI_API_KEY;

// //       if (!apiKey) return res.status(500).json({ error: "OpenAI API Key missing" });

// //       // --- A. PROCESS TECHNICAL ASSESSMENT ---
// //       const techQuestions = masterData.assessment?.questions || [];
// //       const techAnswers = masterData.assessment?.answers || {}; 
      
// //       let techScore = 0;
// //       const techDetails = techQuestions.map((q, index) => {
// //         const selectedOption = techAnswers[index];
// //         const isCorrect = selectedOption === q.correctAnswer;
// //         if (isCorrect) techScore++;

// //         return {
// //           questionId: q.id || index,
// //           questionText: q.question || q.questionText,
// //           options: q.options,
// //           correctAnswer: q.correctAnswer,
// //           userAnswer: selectedOption || "Not Answered",
// //           isCorrect: isCorrect
// //         };
// //       });

// //       // --- B. PROCESS SITUATION ASSESSMENT ---
// //       const sitQuestions = masterData.situation?.questions || [];
// //       const sitAnswers = masterData.situation?.answers || {};
      
// //       let sitScore = 0;
// //       const sitDetails = sitQuestions.map((q, index) => {
// //         const selectedOption = sitAnswers[index];
// //         const isCorrect = selectedOption === q.correctAnswer;
// //         if (isCorrect) sitScore++;

// //         return {
// //           questionId: q.id || index,
// //           questionText: q.question || q.questionText,
// //           options: q.options, 
// //           correctAnswer: q.correctAnswer,
// //           userAnswer: selectedOption || "Not Answered",
// //           isCorrect: isCorrect
// //         };
// //       });

// //       // --- C. PROCESS VOICE INTERVIEW ---
// //       const interviewDataObj = masterData.voiceInterview?.answers || {};
// //       const interviewDetails = Object.values(interviewDataObj).map(item => ({
// //         question: item.question,
// //         answerTranscript: item.answer || item.answerTranscript || "No Audio Detected"
// //       }));

// //       // --- D. GENERATE AI REPORT ---
// //       const systemPrompt = `You are an expert Career Counselor for students in Maharashtra. Output strictly valid JSON.`;
// //       const userPrompt = `
// //         Generate a career assessment report in MARATHI based on:
// //         1. Technical Assessment (${userInfo.subject}): Scored ${techScore}/${techQuestions.length}.
// //         2. Situation Aptitude: Scored ${sitScore}/${sitQuestions.length}.
// //         3. Interview Responses (Sample): "${interviewDetails.slice(0, 2).map(t => t.answerTranscript).join(' ')}..."

// //         Return JSON with keys: summary, strengths, areasForImprovement, careerRoadmap, fullReportMarkdown.
// //       `;

// //       let aiReportData = {
// //           summary: "Analysis Pending (AI Unavailable)",
// //           strengths: [],
// //           areasForImprovement: [],
// //           careerRoadmap: "Review manually.",
// //           fullReportMarkdown: "Generation failed."
// //       };

// //       try {
// //           const response = await fetch('https://api.openai.com/v1/chat/completions', {
// //               method: 'POST',
// //               headers: { 
// //                   'Content-Type': 'application/json', 
// //                   'Authorization': `Bearer ${apiKey}` 
// //               },
// //               body: JSON.stringify({
// //                   model: "gpt-3.5-turbo",
// //                   messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
// //                   temperature: 0.7,
// //                   response_format: { type: "json_object" } 
// //               })
// //           });

// //           const data = await response.json();
// //           if (data.choices && data.choices[0]) {
// //               aiReportData = JSON.parse(data.choices[0].message.content);
// //           }
// //       } catch (aiError) {
// //           console.error("AI Generation Failed:", aiError);
// //       }

// //       // --- E. SAVE TO MONGODB ---
// //       const newReport = new MockResult({
// //         email: email || "anonymous@student.com",
// //         role: "Student",
// //         collageName: "Unknown", 
        
// //         technicalAssessment: {
// //           subject: userInfo.subject,
// //           standard: userInfo.standard,
// //           score: techScore,
// //           totalQuestions: techQuestions.length,
// //           details: techDetails 
// //         },

// //         situationAssessment: {
// //           score: sitScore,
// //           totalQuestions: sitQuestions.length,
// //           details: sitDetails
// //         },

// //         voiceInterview: {
// //           transcripts: interviewDetails,
// //           aiFeedback: "Included in main report"
// //         },

// //         aiReport: {
// //           fullReportMarkdown: aiReportData.fullReportMarkdown,
// //           summary: aiReportData.summary,
// //           strengths: aiReportData.strengths,
// //           areasForImprovement: aiReportData.areasForImprovement,
// //           careerRoadmap: aiReportData.careerRoadmap
// //         }
// //       });

// //       const savedReport = await newReport.save();

// //       console.log(`Report saved | ID: ${savedReport._id}`);

// //       return res.status(200).json({ 
// //           success: true, 
// //           reportId: savedReport._id,
// //           scores: { technical: techScore, situation: sitScore }
// //       });

// //     } catch (error) {
// //       console.error("Submission Error:", error);
// //       return res.status(500).json({ error: error.message || "Internal Server Error" });
// //     }
// //   } 
  
// //   // Method Not Allowed
// //   else {
// //     return res.status(405).json({ message: 'Method not allowed' });
// //   }
// // }


// import mongoose from 'mongoose';
// import MockResult from '@/models/MockResult';

// // --- 1. DATABASE CONNECTION ---
// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 5,
//       serverSelectionTimeoutMS: 10000,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default async function handler(req, res) {
  
//   // ==========================================
//   // 2. GET REQUEST: Fetch Reports
//   // ==========================================
//   if (req.method === 'GET') {
//     try {
//       await dbConnect();
//       const { email, id } = req.query;

//       // Scenario A: Fetch Single Result by ID (For Result Page)
//       if (id) {
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ error: "Invalid Report ID" });
//         }
//         const report = await MockResult.findById(id);
        
//         if (!report) {
//             return res.status(404).json({ error: "Report not found" });
//         }
//         return res.status(200).json({ success: true, report });
//       }

//       // Scenario B: Fetch All Reports by Email (For Student Dashboard)
//       if (email) {
//         const reports = await MockResult.find({ email }).sort({ createdAt: -1 });
//         return res.status(200).json({ success: true, count: reports.length, reports });
//       }

//       // Scenario C: Return EVERYTHING (For Admin/Testing/Postman)
//       // This triggers if neither 'id' nor 'email' is provided
//       const allReports = await MockResult.find({}).sort({ createdAt: -1 });
//       return res.status(200).json({ success: true, count: allReports.length, reports: allReports });

//     } catch (error) {
//       console.error("Fetch Error:", error);
//       return res.status(500).json({ error: "Failed to fetch data" });
//     }
//   }

//   // ==========================================
//   // 3. POST REQUEST: Submit & Generate Report
//   // ==========================================
//   else if (req.method === 'POST') {
//     try {
//       await dbConnect();

//       const { email, userInfo, masterData } = req.body;
//       const apiKey = process.env.OPENAI_API_KEY;

//       if (!apiKey) return res.status(500).json({ error: "OpenAI API Key missing" });

//       // --- A. PROCESS TECHNICAL ASSESSMENT ---
//       const techQuestions = masterData.assessment?.questions || [];
//       const techAnswers = masterData.assessment?.answers || {}; 
      
//       let techScore = 0;
//       const techDetails = techQuestions.map((q, index) => {
//         const selectedOption = techAnswers[index];
//         const isCorrect = selectedOption === q.correctAnswer;
//         if (isCorrect) techScore++;

//         return {
//           questionId: q.id || index,
//           questionText: q.question || q.questionText,
//           options: q.options || [], // Ensure it's an array
//           correctAnswer: q.correctAnswer,
//           userAnswer: selectedOption || "Not Answered",
//           isCorrect: isCorrect
//         };
//       });

//       // --- B. PROCESS SITUATION ASSESSMENT ---
//       const sitQuestions = masterData.situation?.questions || [];
//       const sitAnswers = masterData.situation?.answers || {};
      
//       let sitScore = 0;
//       const sitDetails = sitQuestions.map((q, index) => {
//         const selectedOption = sitAnswers[index];
//         const isCorrect = selectedOption === q.correctAnswer;
//         if (isCorrect) sitScore++;

//         return {
//           questionId: q.id || index,
//           questionText: q.question || q.questionText,
//           options: q.options || [], 
//           correctAnswer: q.correctAnswer,
//           userAnswer: selectedOption || "Not Answered",
//           isCorrect: isCorrect
//         };
//       });

//       // --- C. PROCESS VOICE INTERVIEW ---
//       const interviewDataObj = masterData.voiceInterview?.answers || {};
//       const interviewDetails = Object.values(interviewDataObj).map(item => ({
//         question: item.question,
//         answerTranscript: item.answer || item.answerTranscript || "No Audio Detected"
//       }));

//       // --- D. GENERATE AI REPORT ---
//       const systemPrompt = `You are an expert Career Counselor for students in Maharashtra. Output strictly valid JSON.`;
      
//       const userPrompt = `
//         Generate a career assessment report in MARATHI based on:
//         1. Technical Assessment (${userInfo.subject}): Scored ${techScore}/${techQuestions.length}.
//         2. Situation Aptitude: Scored ${sitScore}/${sitQuestions.length}.
//         3. Interview Responses (Sample): "${interviewDetails.slice(0, 2).map(t => t.answerTranscript).join(' ')}..."

//         Return a JSON object with these exact keys (values must be in Marathi):
//         {
//           "summary": "A motivating summary of their overall performance.",
//           "strengths": ["Strength 1", "Strength 2", "Strength 3"],
//           "areasForImprovement": ["Weakness 1", "Weakness 2", "Weakness 3"],
//           "careerRoadmap": "Advice on what to learn next.",
//           "fullReportMarkdown": "A detailed analysis."
//         }
//       `;

//       let aiReportData = {
//           summary: "AI विश्लेषण प्रलंबित आहे (Pending Analysis)",
//           strengths: ["N/A"],
//           areasForImprovement: ["N/A"],
//           careerRoadmap: "कृपया निकालाचे पुनरावलोकन करा.",
//           fullReportMarkdown: "AI सेवा उपलब्ध नाही."
//       };

//       try {
//           const response = await fetch('https://api.openai.com/v1/chat/completions', {
//               method: 'POST',
//               headers: { 
//                   'Content-Type': 'application/json', 
//                   'Authorization': `Bearer ${apiKey}` 
//               },
//               body: JSON.stringify({
//                   model: "gpt-3.5-turbo",
//                   messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
//                   temperature: 0.7,
//                   response_format: { type: "json_object" } 
//               })
//           });

//           const data = await response.json();
//           if (data.choices && data.choices[0]) {
//               aiReportData = JSON.parse(data.choices[0].message.content);
//           }
//       } catch (aiError) {
//           console.error("AI Generation Failed:", aiError);
//           // We intentionally do NOT return error here, so data is still saved
//       }

//       // --- E. SAVE TO MONGODB ---
//       const newReport = new MockResult({
//         email: email || "anonymous@student.com",
//         role: "Student",
//         collageName: "Unknown", 
        
//         technicalAssessment: {
//           subject: userInfo.subject,
//           standard: userInfo.standard,
//           score: techScore,
//           totalQuestions: techQuestions.length,
//           details: techDetails 
//         },

//         situationAssessment: {
//           score: sitScore,
//           totalQuestions: sitQuestions.length,
//           details: sitDetails
//         },

//         voiceInterview: {
//           transcripts: interviewDetails,
//           aiFeedback: "Included in main report"
//         },

//         aiReport: {
//           fullReportMarkdown: aiReportData.fullReportMarkdown,
//           summary: aiReportData.summary,
//           strengths: aiReportData.strengths,
//           areasForImprovement: aiReportData.areasForImprovement,
//           careerRoadmap: aiReportData.careerRoadmap
//         }
//       });

//       const savedReport = await newReport.save();

//       console.log(`Report saved | ID: ${savedReport._id}`);

//       return res.status(200).json({ 
//           success: true, 
//           reportId: savedReport._id,
//           scores: { technical: techScore, situation: sitScore }
//       });

//     } catch (error) {
//       console.error("Submission Error:", error);
//       return res.status(500).json({ error: error.message || "Internal Server Error" });
//     }
//   } 
  
//   // Method Not Allowed
//   else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }



import mongoose from "mongoose";
import MockResult from "@/models/MockResult";
import jwt from "jsonwebtoken";

// ================= DATABASE =================
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ================= API =================
export default async function handler(req, res) {

  // ================= GET =================
  if (req.method === "GET") {
    try {
      await dbConnect();
      const { email, id } = req.query;

      if (id) {
        const report = await MockResult.findById(id);
        if (!report) return res.status(404).json({ error: "Report not found" });
        return res.json({ success: true, report });
      }

      if (email) {
        const reports = await MockResult.find({ email }).sort({ createdAt: -1 });
        return res.json({ success: true, reports });
      }

      const all = await MockResult.find().sort({ createdAt: -1 });
      return res.json({ success: true, reports: all });

    } catch (e) {
      return res.status(500).json({ error: "Fetch failed" });
    }
  }

  // ================= POST =================
  if (req.method === "POST") {
    try {
      await dbConnect();

      const { email, userInfo, masterData } = req.body;

      // ---------- AUTH ----------
      let collageName = "Unknown";
      let authEmail = email;

      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET || "jwtsecret");
          collageName = decoded.collageName || "Unknown";
          authEmail = decoded.email || email;
        } catch {
          const decoded = jwt.decode(authHeader.split(" ")[1]);
          if (decoded) {
            collageName = decoded.collageName || "Unknown";
            authEmail = decoded.email || email;
          }
        }
      }

      // ---------- TECHNICAL ----------
      const techQ = masterData?.assessment?.questions || [];
      const techA = masterData?.assessment?.answers || {};
      let techScore = 0;

      const techDetails = techQ.map((q, i) => {
        const userAns = techA[i];
        const correct = userAns === q.correctAnswer;
        if (correct) techScore++;

        return {
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: userAns || "Not Answered",
          isCorrect: correct
        };
      });

      // ---------- SITUATION ----------
      const sitQ = masterData?.situation?.questions || [];
      const sitA = masterData?.situation?.answers || {};
      let sitScore = 0;

      const sitDetails = sitQ.map((q, i) => {
        const userAns = sitA[i];
        const correct = userAns === q.correctAnswer;
        if (correct) sitScore++;

        return {
          questionText: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          userAnswer: userAns || "Not Answered",
          isCorrect: correct
        };
      });

      // ---------- VOICE ----------
      const voiceAnswers = masterData?.voiceInterview?.answers || {};
      const transcripts = Object.values(voiceAnswers).map(v => ({
        question: v.question,
        answerTranscript: v.answer || "No audio"
      }));

      // ---------- AI REPORT ----------
      const systemPrompt = `
You are an ITI technical instructor.
Write a structured Marathi performance report.
Use professional tone.
Use Markdown headings.
No emojis.
`;

      const userPrompt = `
Student scored ${techScore} out of ${techQ.length}.
Subject: ${userInfo?.subject || "Unknown"}

Include:
1. एकूण कामगिरी
2. कमकुवत भाग
3. 7 दिवस सुधारणा योजना
4. 2 पुस्तक सूचना
5. 3 YouTube Study Topics (only topic names)
`;

      let aiMarkdown = "AI रिपोर्ट उपलब्ध नाही.";

      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.5,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ]
          })
        });

        const aiData = await aiRes.json();
        aiMarkdown = aiData?.choices?.[0]?.message?.content || aiMarkdown;

      } catch (err) {
        console.error("AI failed:", err);
      }

      // ---------- SAVE ----------
      const report = await MockResult.create({
        email: authEmail,
        collageName,
        role: "Student",

        technicalAssessment: {
          subject: userInfo?.subject,
          standard: userInfo?.standard,
          score: techScore,
          totalQuestions: techQ.length,
          details: techDetails
        },

        situationAssessment: {
          score: sitScore,
          totalQuestions: sitQ.length,
          details: sitDetails
        },

        voiceInterview: {
          transcripts
        },

        aiReport: {
          fullReportMarkdown: aiMarkdown
        }
      });

      return res.json({
        success: true,
        reportId: report._id,
        scores: { technical: techScore, situation: sitScore }
      });

    } catch (err) {
      console.error("Submit error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
