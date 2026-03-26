// //pages/api/submit-full-assessment.js
// import mongoose from "mongoose";
// import MockResult from "../../models/MockResult";
// import User from "../../models/User";
// import jwt from "jsonwebtoken";
// import Video from '../../models/Video';
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

// // ================= API =================
// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     await dbConnect();
// // ================= TEST LIMIT CHECK =================
//     const { email, userInfo, masterData } = req.body;

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
//   "analysis": "Marathi detailed feedback with 3 YouTube Study Topics (topic names only)"
// }
//                 `,
//               },
//               { role: "user", content: combinedVoiceText },
//             ],
//           }),
//         }
//       );

//       const data = await response.json();
//       const result = JSON.parse(
//         data?.choices?.[0]?.message?.content || "{}"
//       );

//       voicePercent = result.score || 0;
//       communicationReport = result.analysis || "विश्लेषण उपलब्ध नाही.";
//     } catch (err) {
//       console.error("Voice AI scoring failed:", err);
//     }

//     // safety clamp
//     voicePercent = Math.min(Math.max(voicePercent, 0), 100);

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

// 5. 3 यूट्यूब अभ्यास विषय (topic names only)
// `);

//     const situationReport = await fetchAI(`
// Student scored ${sitScore}/${sitQ.length} (${sitPercent}%)

// Analyze:
// 1. टीमवर्क
// 2. निर्णय क्षमता
// 3. कॉर्पोरेट वर्तन
// 4. सुधारणा सूचना
// 5. 3 यूट्यूब अभ्यास विषय (topic names only)
// `);

//     const overallSummary = await fetchAI(`
// Technical: ${techPercent}%
// Situation: ${sitPercent}%
// Communication: ${voicePercent}%
// Overall: ${overallScore}%

// Create final career readiness summary in Marathi.
// `);
// // ================= GENERATE RANDOM VIDEOS (ONLY ONCE) =================

// const subject = userInfo?.subject;

// let videoSuggestions = [];

// if (subject) {

//   const technical = await Video.aggregate([
//     { $match: { subject, category: "technical", isActive: true } },
//     { $sample: { size: 3 } }
//   ]);

//   const interview = await Video.aggregate([
//     { $match: { category: "interview", isActive: true } },
//     { $sample: { size: 1 } }
//   ]);

//   const softskill = await Video.aggregate([
//     { $match: { category: "softskill", isActive: true } },
//     { $sample: { size: 1 } }
//   ]);

//   videoSuggestions = [...technical, ...interview, ...softskill];
// }

//     // ============================================================
//     // ================= SAVE TO DATABASE ==========================
//     // ============================================================

//     const report = await MockResult.create({
//       email: authEmail,
//       collageName,
//       role: "Student",

//       technicalAssessment: {
//         subject: userInfo?.subject,
//         // standard: userInfo?.standard,
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
//           videoSuggestions
//       },
//     });
// // ================= REDUCE TEST COUNT =================
// await User.updateOne(
//   { email },
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

//pages/api/submit-full-assessment.js
import mongoose from "mongoose";
import MockResult from "../../models/MockResult";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import Video from '../../models/Video';
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
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `You are a senior ITI career evaluation expert and vocational guidance counselor with 15+ years of experience working with blue collar ITI trades like PCB and Automotive Assembly.

Write detailed, structured Marathi reports using Markdown headings (##).
Rules:
- Be specific and honest — if score is low, say it clearly
- Never give generic advice like "अधिक अभ्यास करा"
- Every suggestion must name a specific workshop topic, tool, or hands-on action
- Use simple Marathi that ITI workshop students can understand
- No emojis
- All advice must be relevant to factory or workshop environment — NOT office environment`,
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

    if (!email || !masterData) {
      return res.status(400).json({ error: "Missing required fields (email or masterData)" });
    }

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
    console.log("Processing voice answers...");

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

  //Wrong Technical Questions
    const wrongTechQuestions = techDetails
  .filter(q => !q.isCorrect)
  .map(q => `Q: ${q.questionText} | Correct: ${q.correctAnswer} | Student answered: ${q.userAnswer}`)
  .join("\n");

    const wrongSitQuestions = sitDetails
  .filter(q => !q.isCorrect)
  .map(q => `Q: ${q.questionText} | Correct: ${q.correctAnswer} | Student answered: ${q.userAnswer}`)
  .join("\n");
    // ============================================================
    // ================= AI REPORTS ================================
    // ============================================================

const technicalReport = await fetchAI(`
विद्यार्थ्याची माहिती:
- विषय: ${userInfo?.subject}
- गुण: ${techScore}/${techQ.length} (${techPercent}%)

विद्यार्थ्याने चुकीची उत्तरे दिलेले प्रश्न:
${wrongTechQuestions || "सर्व उत्तरे बरोबर होती"}

खालील ५ विभागांमध्ये सविस्तर रिपोर्ट तयार करा:

## १. एकूण कामगिरी
३-४ वाक्यांमध्ये प्रामाणिक मूल्यांकन करा. ${techPercent < 50 ? "स्कोर कमी आहे हे स्पष्टपणे सांगा." : "चांगल्या कामगिरीची दखल घ्या."} फक्त स्कोर पुन्हा सांगू नका — त्याचा अर्थ स्पष्ट करा.

## २. कमकुवत क्षेत्रे
वरील चुकीच्या उत्तरांवरून ${userInfo?.subject} विषयातील ३ specific weak topics नाव घेऊन सांगा.
- PCB असल्यास: soldering, circuit reading, component identification यांसारखे topics
- AAO असल्यास: engine assembly, torque settings, component fitting यांसारखे topics

## ३. ७ दिवस सुधारणा योजना
Day 1 ते Day 7 प्रत्येक दिवसासाठी एक ठोस hands-on काम सांगा.
उदा. "Day 1: PCB वर 10 soldering joints practice करा."

## ४. पुस्तक सूचना
${userInfo?.subject} trade साठी थेट उपयुक्त २ पुस्तके सुचवा.
- PCB असल्यास: electronics/PCB/soldering practical books
- AAO असल्यास: automotive/engine/assembly practical books
प्रत्येक पुस्तकाचे नाव आणि लेखकाचे नाव द्या.

## ५. यूट्यूब अभ्यास विषय
३ specific YouTube search topics द्या जे थेट ${userInfo?.subject} workshop skills शी संबंधित आहेत.
`);

// situationReport prompt
const situationReport = await fetchAI(`
विद्यार्थ्याची माहिती:
- ITI Trade: ${userInfo?.subject}
- Situational Assessment गुण: ${sitScore}/${sitQ.length} (${sitPercent}%)

विद्यार्थ्याने चुकीचे निर्णय घेतलेल्या situations:
${wrongSitQuestions || "सर्व उत्तरे बरोबर होती"}

खालील ४ विभागांमध्ये सविस्तर रिपोर्ट तयार करा:

## १. Workshop टीमवर्क आणि सहकार्य
${sitPercent < 50 ? "स्कोर कमी आहे — वरील चुकीच्या situations वरून विद्यार्थी shop floor वर कुठे चुकतो ते २ उदाहरणांसह सांगा." : "कोणते team behaviors shop floor वर दिसतात ते सांगा."} फक्त सामान्य विधाने नको.

## २. निर्णयक्षमता आणि Safety Awareness
${sitPercent < 40 ? "वरील चुकीच्या situations वरून विद्यार्थी कोणत्या workshop situations मध्ये चुकीचा निर्णय घेतो — safety ignore करणे, supervisor ला न सांगणे — हे नाव घेऊन सांगा." : "कोणत्या परिस्थितीत चांगले निर्णय घेतले जातात ते सांगा."} एक real workshop scenario देऊन समजावा.

## ३. कामाची शिस्त आणि व्यावसायिकता
विद्यार्थी कोणत्या factory situation मध्ये यशस्वी होईल आणि कुठे अडचण येईल — SOP following, supervisor relations, safety compliance — हे एका concrete example सह सांगा.

## ४. सुधारणा सूचना आणि यूट्यूब विषय
३ specific behavior changes सुचवा जे workshop मध्ये लगेच implement करता येतील. प्रत्येक सूचना एक ठोस कृती असावी, सामान्य सल्ला नको.
नंतर ३ specific YouTube search topics द्या — workshop behavior, safety आणि teamwork साठी.
`);

//Overall Summary prompt
const overallSummary = await fetchAI(`
विद्यार्थ्याचे गुण:
- ITI Trade: ${userInfo?.subject}
- Technical: ${techPercent}%
- Situational Judgement: ${sitPercent}%
- Communication: ${voicePercent}%
- Overall: ${overallScore}%

खालील ४ विभागांमध्ये final ITI career readiness report तयार करा:

## एकूण ITI करिअर तयारी मूल्यांकन
४-५ वाक्यांमध्ये प्रामाणिक overall picture द्या. कोणता विभाग सर्वात मजबूत आहे आणि कोणता सर्वात कमकुवत आहे ते सांगा. Factory/workshop job साठी हा विद्यार्थी किती तयार आहे ते स्पष्टपणे सांगा.

## मुख्य ताकद
स्कोर pattern वरून ३ specific strengths सांगा जे factory/workshop environment मध्ये उपयुक्त आहेत. "विद्यार्थी मेहनती आहे" असे generic विधान नको — concrete workshop behavioral strength सांगा.

## प्राधान्याने सुधारायचे क्षेत्र
सर्वात महत्त्वाचे २ improvement areas सांगा. प्रत्येकासाठी एक specific first step सांगा जे विद्यार्थी या आठवड्यात workshop मध्ये करू शकतो.

## करिअर मार्गदर्शन
${userInfo?.subject?.toLowerCase().includes("auto") || userInfo?.subject?.toLowerCase().includes("aao")
  ? "AAO trade नुसार २ suitable job roles सुचवा — उदा. Automotive Technician, Assembly Line Operator, Vehicle Mechanic, Quality Inspector."
  : "PCB trade नुसार २ suitable job roles सुचवा — उदा. PCB Assembler, Electronics Technician, Quality Inspector, SMT Operator."
}
प्रत्येकासाठी एक वाक्यात rationale द्या — या profile मुळे हे role का suitable आहे ते सांगा.
`);

// ================= GENERATE RANDOM VIDEOS (ONLY ONCE) =================

const subject = userInfo?.subject;

let videoSuggestions = [];

if (subject) {

  const technical = await Video.aggregate([
    { $match: { subject, category: "technical", isActive: true } },
    { $sample: { size: 3 } }
  ]);

  const interview = await Video.aggregate([
    { $match: { category: "interview", isActive: true } },
    { $sample: { size: 1 } }
  ]);

  const softskill = await Video.aggregate([
    { $match: { category: "softskill", isActive: true } },
    { $sample: { size: 1 } }
  ]);

  videoSuggestions = [...technical, ...interview, ...softskill];
}

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
          videoSuggestions
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
    console.error("Submit error details:", err);
    return res.status(500).json({ 
      error: "An error occurred during submission. Please try again.",
      message: err.message 
    });
  }
}