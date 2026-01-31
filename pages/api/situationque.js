import mongoose from 'mongoose';
import AssessmentReport from '@/models/assessmentReport';

// --- DATABASE CONNECTION ---
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(500).json({ error: "Database connection failed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const url = 'https://api.openai.com/v1/chat/completions';

  // ==========================================
  //  HANDLE GET REQUEST (Generate Questions with Defaults)
  // ==========================================
  if (req.method === 'GET') {
    if (!apiKey) return res.status(500).json({ error: "OpenAI API Key not configured" });

    try {
      // DEFAULT SETTINGS since no input is provided
      const standard = "General";
      const subject = "General Aptitude";
      const questionCount = 10; 

      const systemPrompt = `You are an expert Psychologist. Output strictly valid JSON array only. No markdown. No extra text.`;
      
      const userPrompt = `Create exactly ${questionCount} Situation Reaction Test (MCQ) questions in Marathi suitable for a student.
      
      The situations should test: 
      1. Decision Making (निर्णय क्षमता)
      2. Workplace Ethics (कामाच्या ठिकाणची नैतिकता)
      3. Teamwork & Leadership (संघभावना आणि नेतृत्व)

      Output format (RAW JSON Array):
      [
        {
          "id": 1,
          "question": "A detailed description of a challenging situation in Marathi...",
          "options": ["Marathi Opt A", "Marathi Opt B", "Marathi Opt C", "Marathi Opt D"],
          "correctAnswer": "Exact text of the correct option"
        }
      ]`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.error) {
          return res.status(500).json({ error: data.error.message });
      }

      const aiContent = data.choices[0].message.content;

      // Robust Parsing
      let parsedQuestions = [];
      const cleanContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/); 
      
      if (jsonMatch) {
         parsedQuestions = JSON.parse(jsonMatch[0]);
      } else {
         parsedQuestions = JSON.parse(cleanContent);
      }

      return res.status(200).json({ result: parsedQuestions });

    } catch (error) {
      console.error("GET Generation Error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate questions" });
    }
  }

  // ==========================================
  //  HANDLE POST REQUEST (Custom Generation or Evaluation)
  // ==========================================
  else if (req.method === 'POST') {
    const { type, standard, subject, questions, userAnswers, email, collageName, role } = req.body;

    if (!apiKey) return res.status(500).json({ error: "OpenAI API Key not configured" });

    try {
      // --- SCENARIO 1: GENERATE SITUATION QUESTIONS (Custom Input) ---
      if (type === 'generate_questions') {
        const questionCount = 10; 
        const systemPrompt = `You are an expert Psychologist. Output strictly valid JSON array only. No markdown.`;
        const userPrompt = `Create exactly ${questionCount} Situation Reaction Test (MCQ) questions in Marathi for Class ${standard} (${subject} stream).
        Output format (RAW JSON Array):
        [{"id":1, "question":"Marathi text...", "options":["A","B","C","D"], "correctAnswer":"A"}]`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        if (data.error) return res.status(500).json({ error: data.error.message });

        const aiContent = data.choices[0].message.content;
        const cleanContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleanContent.match(/\[[\s\S]*\]/); 
        const parsedQuestions = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanContent);

        return res.status(200).json({ result: parsedQuestions });
      } 

      // --- SCENARIO 2: EVALUATE & SAVE REPORT ---
      else if (type === 'evaluate_answers') {
        if (!email) return res.status(400).json({ error: "User login required" });

        let calculatedScore = 0;
        const totalQuestions = questions.length;

        questions.forEach((q, index) => {
          if (userAnswers[index] && userAnswers[index] === q.correctAnswer) {
            calculatedScore++;
          }
        });

        const systemPrompt = `You are a career counselor speaking Marathi. Analyze the student's behavioral aptitude.`;
        const userPrompt = `The student scored ${calculatedScore}/${totalQuestions} in a Situation Reaction Test (SRT). Provide a Markdown report in Marathi covering Decision Making, Ethics, and Improvement Tips.`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        const aiAnalysis = data.choices?.[0]?.message?.content || "Analysis could not be generated.";

        const newReport = new AssessmentReport({
          role: role || 'Student',
          subject: "Situation Aptitude", 
          type: 'Situation',             
          email: email,
          collageName: collageName || 'Unknown College',
          reportAnalysis: aiAnalysis,
          score: calculatedScore,
          totalQuestions: totalQuestions,
          createdAt: new Date()
        });

        await newReport.save();

        return res.status(200).json({ 
            result: aiAnalysis, 
            score: calculatedScore, 
            total: totalQuestions 
        });
      }

    } catch (error) {
      console.error("API Logic Error:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}