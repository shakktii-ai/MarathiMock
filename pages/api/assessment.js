import mongoose from "mongoose";
import AssessmentReport from "@/models/assessmentReport";

// ===============================
// DATABASE CONNECTION
// ===============================
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ===============================
// CLEAN JSON
// ===============================
function cleanJSON(text) {
  return text.replace(/```json|```/g, "").trim();
}

// ===============================
// API HANDLER
// ===============================
export default async function handler(req, res) {
  await dbConnect();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "OpenAI key missing" });

  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

  // ==================================================
  // GET → FETCH REPORTS
  // ==================================================
  if (req.method === "GET") {
    const { email } = req.query;

    if (!email)
      return res.status(400).json({ error: "Email required" });

    const reports = await AssessmentReport.find({ email }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ reports });
  }

  // ==================================================
  // POST → GENERATE OR EVALUATE
  // ==================================================
  if (req.method === "POST") {
    const {
      type,
      subject,
      questions,
      userAnswers,
      email,
      collageName,
      role,
    } = req.body;

    // ==========================================
    // 1️⃣ GENERATE QUESTIONS
    // ==========================================
    if (type === "generate_questions") {
      const systemPrompt = `
You are a strict ITI Trade Theory examiner.

Return ONLY valid JSON array.
No markdown.
No explanation.
No extra text.

Rules:
- Exactly 20 MCQs
- Marathi language only
- Practical job-oriented
- 4 options
- Only one correct answer
- No repetition
- No "वरीलपैकी सर्व"

Technical words must be Marathi pronunciation:
सोल्डरिंग, मल्टीमीटर, सर्किट, टॉर्क रेंच, गिअरबॉक्स
`;

      const userPrompt = `
Subject: ${subject}

Generate ITI Trade Theory MCQs.

Return strictly:

[
  {
    "id": 1,
    "question": "मराठी प्रश्न",
    "options": ["A","B","C","D"],
    "correctAnswer": "Exact option text"
  }
]
`;

      try {
        const response = await fetch(OPENAI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.4,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          }),
        });

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content)
          return res
            .status(500)
            .json({ error: "AI did not return content" });

        const parsed = JSON.parse(cleanJSON(content));

        return res.status(200).json({ result: parsed });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Question generation failed" });
      }
    }

    // ==========================================
    // 2️⃣ EVALUATE & SAVE
    // ==========================================
    if (type === "evaluate_answers") {
      if (!email)
        return res.status(400).json({ error: "Login required" });

      let score = 0;

      questions.forEach((q, i) => {
        if (userAnswers[i] === q.correctAnswer) score++;
      });

      const newReport = new AssessmentReport({
        role: role || "Student",
        subject,
        email,
        collageName: collageName || "Unknown",
        score,
        totalQuestions: questions.length,
      });

      await newReport.save();

      return res.status(200).json({
        success: true,
        score,
        total: questions.length,
      });
    }

    return res.status(400).json({ error: "Invalid request type" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
