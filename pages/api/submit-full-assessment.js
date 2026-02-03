//pages/api/submit-full-assessment.js
import mongoose from "mongoose";
import MockResult from "../../models/MockResult";
import User from "../../models/User";
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

// ================= GENERIC AI HELPER =================
async function fetchAI(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              "You are an expert ITI career evaluator. Write structured Marathi report using Markdown headings. No emojis.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "AI रिपोर्ट उपलब्ध नाही.";
  } catch (err) {
    console.error("AI Error:", err);
    return "AI रिपोर्ट तयार होऊ शकला नाही.";
  }
}

// ================= API =================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
// ================= TEST LIMIT CHECK =================
    const { email, userInfo, masterData } = req.body;

const existingUser = await User.findOne({ email });

if (!existingUser) {
  return res.status(404).json({ error: "User not found" });
}

if (existingUser.no_of_tests <= 0) {
  return res.status(403).json({
    error: "You have reached your assessment limit."
  });
}



    // ================= AUTH =================
    let collageName = "Unknown";
    let authEmail = email;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          process.env.JWT_SECRET || "jwtsecret"
        );
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

    // ============================================================
    // ================= TECHNICAL ASSESSMENT =====================
    // ============================================================

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
        isCorrect: correct,
      };
    });

    const techPercent = techQ.length
      ? Math.round((techScore / techQ.length) * 100)
      : 0;

    // ============================================================
    // ================= SITUATION ASSESSMENT =====================
    // ============================================================

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
        isCorrect: correct,
      };
    });

    const sitPercent = sitQ.length
      ? Math.round((sitScore / sitQ.length) * 100)
      : 0;

    // ============================================================
    // ================= VOICE (AI QUALITY SCORING) ===============
    // ============================================================

    const voiceAnswers = masterData?.voiceInterview?.answers || {};

    const transcripts = Object.values(voiceAnswers).map((v) => ({
      question: v.question,
      answerTranscript: v.answer || v.answerTranscript || "",
    }));

    const combinedVoiceText = transcripts
      .map((t) => `Q: ${t.question}\nA: ${t.answerTranscript}`)
      .join("\n\n");

    let voicePercent = 0;
    let communicationReport = "AI विश्लेषण उपलब्ध नाही.";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.4,
            messages: [
              {
                role: "system",
                content: `
You are a professional HR communication evaluator.

Evaluate:
- Clarity
- Confidence
- Professional tone
- Relevance
- Sentence structure

Respond strictly in JSON:
{
  "score": number (0-100),
  "analysis": "Marathi detailed feedback with 3 YouTube Study Topics (topic names only)"
}
                `,
              },
              { role: "user", content: combinedVoiceText },
            ],
          }),
        }
      );

      const data = await response.json();
      const result = JSON.parse(
        data?.choices?.[0]?.message?.content || "{}"
      );

      voicePercent = result.score || 0;
      communicationReport = result.analysis || "विश्लेषण उपलब्ध नाही.";
    } catch (err) {
      console.error("Voice AI scoring failed:", err);
    }

    // safety clamp
    voicePercent = Math.min(Math.max(voicePercent, 0), 100);

    // ============================================================
    // ================= OVERALL SCORE =============================
    // ============================================================

    const overallScore = Math.round(
      techPercent * 0.5 +
      sitPercent * 0.3 +
      voicePercent * 0.2
    );

    // ============================================================
    // ================= AI REPORTS ================================
    // ============================================================

    const technicalReport = await fetchAI(`
Student scored ${techScore}/${techQ.length} (${techPercent}%)
Subject: ${userInfo?.subject}

Create:
1. एकूण कामगिरी
2. कमकुवत भाग
3. 7 दिवस सुधारणा योजना
4. 2 पुस्तक सूचना — ONLY suggest books relevant to the SPECIFIC Subject (${userInfo?.subject}).
   - If subject = PCB: recommend PCB / electronics / circuit board books
   - If subject = AAO: recommend Automotive / Assembly / Workshop related books

5. 3 यूट्यूब अभ्यास विषय (topic names only)
`);

    const situationReport = await fetchAI(`
Student scored ${sitScore}/${sitQ.length} (${sitPercent}%)

Analyze:
1. टीमवर्क
2. निर्णय क्षमता
3. कॉर्पोरेट वर्तन
4. सुधारणा सूचना
5. 3 यूट्यूब अभ्यास विषय (topic names only)
`);

    const overallSummary = await fetchAI(`
Technical: ${techPercent}%
Situation: ${sitPercent}%
Communication: ${voicePercent}%
Overall: ${overallScore}%

Create final career readiness summary in Marathi.
`);

    // ============================================================
    // ================= SAVE TO DATABASE ==========================
    // ============================================================

    const report = await MockResult.create({
      email: authEmail,
      collageName,
      role: "Student",

      technicalAssessment: {
        subject: userInfo?.subject,
        // standard: userInfo?.standard,
        score: techScore,
        totalQuestions: techQ.length,
        percentage: techPercent,
        details: techDetails,
      },

      situationAssessment: {
        score: sitScore,
        totalQuestions: sitQ.length,
        percentage: sitPercent,
        details: sitDetails,
      },

      voiceInterview: {
        transcripts,
        percentage: voicePercent,
      },

      aiReport: {
        technicalReport,
        situationReport,
        communicationReport,
        overallSummary,
        overallScore,
      },
    });
// ================= REDUCE TEST COUNT =================
await User.updateOne(
  { email },
  { $inc: { no_of_tests: -1 } }
);

    return res.json({
      success: true,
      reportId: report._id,
      scores: {
        technical: techPercent,
        situation: sitPercent,
        communication: voicePercent,
        overall: overallScore,
      },
    });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: err.message });
  }
}


//pages/api/submit-full-assessment.js
// import mongoose from "mongoose";
// import MockResult from "../../models/MockResult";
// import User from "../../models/User";
// import jwt from "jsonwebtoken";

// // ================= DATABASE =================
// const MONGODB_URI = process.env.MONGODB_URI;

// let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//       maxPoolSize: 5,
//       serverSelectionTimeoutMS: 10000,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// // ================= GENERIC AI HELPER =================
// async function fetchAI(prompt) {
//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         temperature: 0.5,
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an expert ITI career evaluator. Write structured Marathi report using Markdown headings. No emojis.",
//           },
//           { role: "user", content: prompt },
//         ],
//       }),
//     });

//     const data = await response.json();
//     return data?.choices?.[0]?.message?.content || "AI रिपोर्ट उपलब्ध नाही.";
//   } catch (err) {
//     console.error("AI Error:", err);
//     return "AI रिपोर्ट तयार होऊ शकला नाही.";
//   }
// }

// async function getYouTubeVideo(query) {
//   if (!process.env.YOUTUBE_API_KEY) {
//     console.error("YOUTUBE_API_KEY is missing.");
//     return null;
//   }

//   try {
//     const params = new URLSearchParams({
//   part: "snippet",
//   q: query,
//   type: "video",
//   videoDuration: "medium", // medium (4–20 min) OR long (>20 min)
//   maxResults: "1",
//   key: process.env.YOUTUBE_API_KEY,
// });

//     const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
    
//     if (!res.ok) return null;

//     const data = await res.json();
//     const item = data?.items?.[0];

//     if (!item) return null;

//     return {
//       title: item.snippet.title,
//       videoId: item.id.videoId,
//       url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
//       thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
//       description: item.snippet.description
//     };
//   } catch (err) {
//     console.error("YouTube Fetch Error:", err);
//     return null;
//   }
// }

// // ================= API =================
// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     await dbConnect();
// // ================= TEST LIMIT CHECK =================

// const { email, userInfo, masterData } = req.body;

// const existingUser = await User.findOne({ email });

// if (!existingUser) {
//   return res.status(404).json({ error: "User not found" });
// }

// if (existingUser.no_of_tests <= 0) {
//   return res.status(403).json({
//     error: "You have reached your assessment limit."
//   });
// }

    


//     // ================= AUTH =================
//     let collageName = "Unknown";
//     let authEmail = email;

//     const authHeader = req.headers.authorization;
//     if (authHeader?.startsWith("Bearer ")) {
//       try {
//         const decoded = jwt.verify(
//           authHeader.split(" ")[1],
//           process.env.JWT_SECRET || "jwtsecret"
//         );
//         collageName = decoded.collageName || "Unknown";
//         authEmail = decoded.email || email;
//       } catch {
//         const decoded = jwt.decode(authHeader.split(" ")[1]);
//         if (decoded) {
//           collageName = decoded.collageName || "Unknown";
//           authEmail = decoded.email || email;
//         }
//       }
//     }

//     // ============================================================
//     // ================= TECHNICAL ASSESSMENT =====================
//     // ============================================================

//     const techQ = masterData?.assessment?.questions || [];
//     const techA = masterData?.assessment?.answers || {};
//     let techScore = 0;

//     const techDetails = techQ.map((q, i) => {
//       const userAns = techA[i];
//       const correct = userAns === q.correctAnswer;
//       if (correct) techScore++;

//       return {
//         questionText: q.question,
//         options: q.options,
//         correctAnswer: q.correctAnswer,
//         userAnswer: userAns || "Not Answered",
//         isCorrect: correct,
//       };
//     });

//     const techPercent = techQ.length
//       ? Math.round((techScore / techQ.length) * 100)
//       : 0;

//     // ============================================================
//     // ================= SITUATION ASSESSMENT =====================
//     // ============================================================

//     const sitQ = masterData?.situation?.questions || [];
//     const sitA = masterData?.situation?.answers || {};
//     let sitScore = 0;

//     const sitDetails = sitQ.map((q, i) => {
//       const userAns = sitA[i];
//       const correct = userAns === q.correctAnswer;
//       if (correct) sitScore++;

//       return {
//         questionText: q.question,
//         options: q.options,
//         correctAnswer: q.correctAnswer,
//         userAnswer: userAns || "Not Answered",
//         isCorrect: correct,
//       };
//     });

//     const sitPercent = sitQ.length
//       ? Math.round((sitScore / sitQ.length) * 100)
//       : 0;

//     // ============================================================
//     // ================= VOICE (AI QUALITY SCORING) ===============
//     // ============================================================

//     const voiceAnswers = masterData?.voiceInterview?.answers || {};

//     const transcripts = Object.values(voiceAnswers).map((v) => ({
//       question: v.question,
//       answerTranscript: v.answer || v.answerTranscript || "",
//     }));

//     const combinedVoiceText = transcripts
//       .map((t) => `Q: ${t.question}\nA: ${t.answerTranscript}`)
//       .join("\n\n");

//     let voicePercent = 0;
//     let communicationReport = "AI विश्लेषण उपलब्ध नाही.";

//     try {
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: "gpt-4o-mini",
//             temperature: 0.4,
//             messages: [
//               {
//                 role: "system",
//                 content: `
// You are a professional HR communication evaluator.

// Evaluate:
// - Clarity
// - Confidence
// - Professional tone
// - Relevance
// - Sentence structure

// Respond strictly in JSON:
// {
//   "score": number (0-100),
//   "analysis": "Marathi detailed feedback."
// }
//                 `,
//               },
//               { role: "user", content: combinedVoiceText },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       const content = data?.choices?.[0]?.message?.content || "{}";
//       const cleanContent = content.replace(/```json|```/g, "").trim();
//       const result = JSON.parse(cleanContent);

//       voicePercent = result.score || 0;
//       communicationReport = result.analysis || "विश्लेषण उपलब्ध नाही.";
//     } catch (err) {
//       console.error("Voice AI scoring failed:", err);
//     }

//     voicePercent = Math.min(Math.max(voicePercent, 0), 100);

//     // ============================================================
//     // ================= VIDEO SUGGESTION LOGIC (FIXED) ===========
//     // ============================================================
    
//     // Calculate context for the Prompt
//     const subject = userInfo?.subject || "ITI Trade";
//     const wrongTechQuestions = techDetails.filter(q => !q.isCorrect).map(q => q.questionText);
//     const techPerformance = wrongTechQuestions.length > 0 
//         ? `Mistakes: ${JSON.stringify(wrongTechQuestions)}` 
//         : "Perfect Score (Suggest Advanced Topics)";
    
//     // Explicitly asking for 2+2+2 structure
//     const videoPrompt = `
// Student Subject: ${subject}
// Technical Score: ${techPercent}% (${techPerformance})
// Situation Score: ${sitPercent}%
// Interview Score: ${voicePercent}%

// Task:
// Suggest exactly 6 YouTube search queries in a STRICT JSON format.

// Distribution:
// 1. 4 videos on the Technical Subject (${subject})
//    - If the score is low, suggest basic concepts.
//    - If the score is 100%, suggest advanced industrial techniques (must be strictly subject-related).
//    - video must be different 

// 2. 1 videos on Interview / Mock Preparation
//    - Focus on confidence, self-introduction, or HR mock interview questions.

// 3. 1 videos on Situational / Soft Skills
//    - Focus on teamwork, leadership, or workplace ethics (situation-based).

// Return JSON ONLY:
// {
//   "videos": [
//     { "query": "Search term 1", "reason": "Reason 1 (Marathi)" },
//     { "query": "Search term 2", "reason": "Reason 2 (Marathi)" },
//     { "query": "Search term 3", "reason": "Reason 3 (Marathi)" },
//     { "query": "Search term 4", "reason": "Reason 4 (Marathi)" },
//     { "query": "Search term 5", "reason": "Reason 5 (Marathi)" },
//     { "query": "Search term 6", "reason": "Reason 6 (Marathi)" }
//   ]
// }

// Important:
// - All videos must be in the Marathi, Hindi, English language.
// - must b different videos
// `;


//     // 1. Fetch suggestions from AI
//     const videoAiRawResponse = await fetchAI(videoPrompt);
    
//     let videoSuggestions = [];
//     let videoQueryData = null;

//     // 2. Parse JSON safely
//     try {
//       const cleanJson = videoAiRawResponse
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();
//       videoQueryData = JSON.parse(cleanJson);
//     } catch (e) {
//       console.error("Failed to parse Video AI JSON:", e);
//     }

//     // 3. Fetch real YouTube videos
//     if (videoQueryData?.videos && Array.isArray(videoQueryData.videos)) {
//         const videoPromises = videoQueryData.videos.map(async (item) => {
//             const videoDetails = await getYouTubeVideo(item.query);
//             if (!videoDetails) return null;
            
//             return {
//                 ...videoDetails,
//                 aiReason: item.reason 
//             };
//         });

//         const results = await Promise.all(videoPromises);
//         videoSuggestions = results.filter(Boolean);
//     }

//     // ============================================================
//     // ================= OVERALL SCORE =============================
//     // ============================================================

//     const overallScore = Math.round(
//       techPercent * 0.5 +
//       sitPercent * 0.3 +
//       voicePercent * 0.2
//     );

//     // ============================================================
//     // ================= AI REPORTS ================================
//     // ============================================================

//     const technicalReport = await fetchAI(`
// Student scored ${techScore}/${techQ.length} (${techPercent}%)
// Subject: ${userInfo?.subject}

// Create:
// 1. एकूण कामगिरी
// 2. कमकुवत भाग
// 3. 7 दिवस सुधारणा योजना
// 4. 2 पुस्तक सूचना — ONLY suggest books relevant to the SPECIFIC Subject (${userInfo?.subject}).
//    - If subject = PCB: recommend PCB / electronics / circuit board books
//    - If subject = AAO: recommend Automotive / Assembly / Workshop related books
// `);

//     const situationReport = await fetchAI(`
// Student scored ${sitScore}/${sitQ.length} (${sitPercent}%)

// Analyze:
// 1. टीमवर्क
// 2. निर्णय क्षमता
// 3. कॉर्पोरेट वर्तन
// 4. सुधारणा सूचना
// `);

//     const overallSummary = await fetchAI(`
// Technical: ${techPercent}%
// Situation: ${sitPercent}%
// Communication: ${voicePercent}%
// Overall: ${overallScore}%

// Create final career readiness summary in Marathi.
// `);

//     // ============================================================
//     // ================= SAVE TO DATABASE ==========================
//     // ============================================================

//     const report = await MockResult.create({
//       email: authEmail,
//       collageName,
//       role: "Student",

//       technicalAssessment: {
//         subject: userInfo?.subject,
//         score: techScore,
//         totalQuestions: techQ.length,
//         percentage: techPercent,
//         details: techDetails,
//       },

//       situationAssessment: {
//         score: sitScore,
//         totalQuestions: sitQ.length,
//         percentage: sitPercent,
//         details: sitDetails,
//       },

//       voiceInterview: {
//         transcripts,
//         percentage: voicePercent,
//       },

//       aiReport: {
//         technicalReport,
//         situationReport,
//         communicationReport,
//         overallSummary,
//         overallScore,
//         videoSuggestions 
//       },
//     });
// // ================= REDUCE TEST COUNT =================

// await User.updateOne(
//   { email: authEmail },
//   { $inc: { no_of_tests: -1 } }
// );

//     return res.json({
//       success: true,
//       reportId: report._id,
//       scores: {
//         technical: techPercent,
//         situation: sitPercent,
//         communication: voicePercent,
//         overall: overallScore,
//       },
//     });
//   } catch (err) {
//     console.error("Submit error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }