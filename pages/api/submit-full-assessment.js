//pages/api/submit-full-assessment.js
import mongoose from "mongoose";
import MockResult from "../../models/MockResult";
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

    const { email, userInfo, masterData } = req.body;

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

5. 3 YouTube Study Topics (topic names only)
`);

    const situationReport = await fetchAI(`
Student scored ${sitScore}/${sitQ.length} (${sitPercent}%)

Analyze:
1. टीमवर्क
2. निर्णय क्षमता
3. कॉर्पोरेट वर्तन
4. सुधारणा सूचना
5. 3 YouTube Study Topics (topic names only)
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
        standard: userInfo?.standard,
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
