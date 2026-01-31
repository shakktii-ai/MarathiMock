// import mongoose from 'mongoose';
// import AssessmentReport from '@/models/assessmentReport';

// // --- DATABASE CONNECTION ---
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

// // --- HELPER: SAFE JSON PARSER ---
// function safeJSONParse(jsonString, fallbackData) {
//   try {
//     // 1. Basic Clean: Remove markdown code blocks
//     let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

//     // 2. Extract Array: Find the first '[' and the LAST ']'
//     const firstBracket = clean.indexOf('[');
//     const lastBracket = clean.lastIndexOf(']');
    
//     if (firstBracket !== -1 && lastBracket !== -1) {
//       clean = clean.substring(firstBracket, lastBracket + 1);
//     }

//     return JSON.parse(clean);
//   } catch (e) {
//     console.error("JSON Parse Failed. Attempting repair...", e.message);
    
//     // 3. Repair Truncated JSON (If AI cut off in the middle)
//     try {
//       let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
//       const firstBracket = clean.indexOf('[');
//       if (firstBracket !== -1) {
//         // Find the last closing brace '}' which signifies the end of the last complete object
//         const lastBrace = clean.lastIndexOf('}');
//         if (lastBrace !== -1) {
//             // Cut off everything after the last complete object and close the array
//             clean = clean.substring(firstBracket, lastBrace + 1) + ']';
//             return JSON.parse(clean);
//         }
//       }
//     } catch (repairError) {
//       console.error("Repair Failed. Using Fallback.", repairError.message);
//     }
    
//     return fallbackData;
//   }
// }

// export default async function handler(req, res) {
//   const apiKey = process.env.OPENAI_API_KEY;

//   // 1. Establish DB Connection
//   try {
//     await dbConnect();
//   } catch (error) {
//     console.error("Database connection failed:", error);
//   }

//   const url = 'https://api.openai.com/v1/chat/completions';

//   // ==========================================
//   //  HANDLE POST REQUEST
//   // ==========================================
//   if (req.method === 'POST') {
//     const { type, standard, subject, questions, userAnswers, email, collageName, role } = req.body;

//     if (!apiKey) return res.status(500).json({ error: "OpenAI API Key not configured" });

//     try {
//       // --- SCENARIO 1: GENERATE SITUATION QUESTIONS ---
//       if (type === 'generate_questions') {
//         // We reduce count to 15 to prevent token truncation (Max tokens often cut off 20 detailed questions)
//         const questionCount = 10; 
        
//         const systemPrompt = `You are a strict JSON generator. You never output conversational text. Output only a raw JSON array.`;
//         const userPrompt = `Create exactly ${questionCount} Situation Reaction Test (MCQ) questions in Marathi for Class ${standard} (${subject}).
        
//         Topics: Decision Making, Ethics, Leadership.

//         Strict JSON Array Format:
//         [{"id":1,"question":"Marathi Text","options":["A","B","C","D"],"correctAnswer":"A"}]`;

//         const response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
//             temperature: 0.7,
//             max_tokens: 2500 // Increased limit
//           })
//         });

//         const data = await response.json();
//         if (data.error) return res.status(500).json({ error: data.error.message });

//         const aiContent = data.choices[0].message.content;

//         // FALLBACK DATA (In case AI fails completely)
//         const fallback = Array.from({ length: 10 }, (_, i) => ({
//             id: i + 1,
//             question: `(Server Backup) खालीलपैकी कोणत्या परिस्थितीत तुम्ही काय कराल? प्रश्न ${i + 1}`,
//             options: ["पर्याय 1", "पर्याय 2", "पर्याय 3", "पर्याय 4"],
//             correctAnswer: "पर्याय 1"
//         }));

//         // USE SAFE PARSER
//         const parsedQuestions = safeJSONParse(aiContent, fallback);

//         return res.status(200).json({ result: parsedQuestions });
//       } 

//       // --- SCENARIO 2: EVALUATE & SAVE REPORT ---
//       else if (type === 'evaluate_answers') {
//         if (!email) return res.status(400).json({ error: "User login required" });

//         let calculatedScore = 0;
//         const totalQuestions = questions.length;

//         questions.forEach((q, index) => {
//           if (userAnswers[index] && String(userAnswers[index]).trim() === String(q.correctAnswer).trim()) {
//             calculatedScore++;
//           }
//         });

//         const systemPrompt = `You are a career counselor speaking Marathi.`;
//         const userPrompt = `The student scored ${calculatedScore}/${totalQuestions} in a Situation Reaction Test. Provide a Markdown report in Marathi covering Decision Making and Ethics.`;

//         const response = await fetch(url, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
//             temperature: 0.7
//           })
//         });

//         const data = await response.json();
//         const aiAnalysis = data.choices?.[0]?.message?.content || "Analysis could not be generated.";

//         const newReport = new AssessmentReport({
//           role: role || 'Student',
//           subject: "Situation Aptitude", 
//           type: 'Situation',             
//           email: email,
//           collageName: collageName || 'Unknown College',
//           reportAnalysis: aiAnalysis,
//           score: calculatedScore,
//           totalQuestions: totalQuestions,
//           createdAt: new Date()
//         });

//         await newReport.save();

//         return res.status(200).json({ 
//             result: aiAnalysis, 
//             score: calculatedScore, 
//             total: totalQuestions 
//         });
//       }

//     } catch (error) {
//       console.error("API Logic Error:", error);
//       // Return a 200 with fallback data instead of 500 to keep UI alive
//       return res.status(200).json({ 
//         result: Array.from({ length: 5 }, (_, i) => ({
//              id: i, question: "Error generating questions. Please try again.", options: ["A","B","C","D"], correctAnswer: "A"
//         })) 
//       });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }

// import mongoose from 'mongoose';
// import AssessmentReport from '@/models/assessmentReport';

// // --- DATABASE CONNECTION ---
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

// // --- HELPER: SAFE JSON PARSER (Fixes the "SyntaxError") ---
// function safeJSONParse(jsonString, fallbackData) {
//   try {
//     // 1. Basic Clean: Remove markdown code blocks
//     let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

//     // 2. Extract Array: Find the first '[' and the LAST ']'
//     const firstBracket = clean.indexOf('[');
//     const lastBracket = clean.lastIndexOf(']');
    
//     if (firstBracket !== -1 && lastBracket !== -1) {
//       clean = clean.substring(firstBracket, lastBracket + 1);
//     }

//     return JSON.parse(clean);
//   } catch (e) {
//     console.error("JSON Parse Failed. Attempting repair...", e.message);
    
//     // 3. Repair Truncated JSON (If AI cut off in the middle)
//     try {
//       let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
//       const firstBracket = clean.indexOf('[');
//       if (firstBracket !== -1) {
//         // Find the last closing brace '}' 
//         const lastBrace = clean.lastIndexOf('}');
//         if (lastBrace !== -1) {
//             // Cut off everything after the last complete object and close the array
//             clean = clean.substring(firstBracket, lastBrace + 1) + ']';
//             return JSON.parse(clean);
//         }
//       }
//     } catch (repairError) {
//       console.error("Repair Failed. Using Fallback.");
//     }
    
//     return fallbackData;
//   }
// }

// export default async function handler(req, res) {
//   const apiKey = process.env.OPENAI_API_KEY;

//   try {
//     await dbConnect();
//   } catch (error) {
//     console.error("Database connection failed:", error);
//   }

//   const url = 'https://api.openai.com/v1/chat/completions';

//   // ==========================================
//   //  HANDLE GET REQUEST (Generation)
//   // ==========================================
//   if (req.method === 'GET') {
//     if (!apiKey) return res.status(500).json({ error: "OpenAI API Key not configured" });

//     // 1. Get Params from Query URL (e.g. ?standard=12&subject=Science)
//     const { standard = "General", subject = "General Aptitude" } = req.query;

//     try {
//       // 2. Prompt Engineering
//       const questionCount = 20; // Safer limit to prevent timeout/truncation
      
//       const systemPrompt = `You are an expert Psychologist. Output strictly valid JSON array only. No markdown.`;
//       const userPrompt = `Create exactly ${questionCount} Situation Reaction Test (MCQ) questions in Marathi for a student in Class ${standard} (${subject}).
      
//       The situations should test: 
//       1. Decision Making (निर्णय क्षमता)
//       2. Workplace Ethics (कामाच्या ठिकाणची नैतिकता)
//       3. Teamwork & Leadership (संघभावना आणि नेतृत्व)

//       Output format (RAW JSON Array):
//       [
//         {
//           "id": 1,
//           "question": "A detailed description of a challenging situation in Marathi...",
//           "options": ["Marathi Opt A", "Marathi Opt B", "Marathi Opt C", "Marathi Opt D"],
//           "correctAnswer": "Exact text of the correct option"
//         }
//       ]
//       and give 20 question in ablove format  
//       `
      
//       ;

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
//         body: JSON.stringify({
//           model: "gpt-3.5-turbo-16k",
//           messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
//           temperature: 0.7,
//           max_tokens: 2500 
//         })
//       });

//       const data = await response.json();
      
//       if (data.error) {
//           return res.status(500).json({ error: data.error.message });
//       }

//       const aiContent = data.choices[0].message.content;

//       // 3. Fallback Data (In case AI fails)
//       const fallback = Array.from({ length: 5 }, (_, i) => ({
//           id: i + 1,
//           question: `(Server Backup) खालीलपैकी कोणत्या परिस्थितीत तुम्ही काय कराल? प्रश्न ${i + 1}`,
//           options: ["पर्याय 1", "पर्याय 2", "पर्याय 3", "पर्याय 4"],
//           correctAnswer: "पर्याय 1"
//       }));

//       // 4. Safe Parse
//       const parsedQuestions = safeJSONParse(aiContent, fallback);

//       return res.status(200).json({ result: parsedQuestions });

//     } catch (error) {
//       console.error("GET Generation Error:", error);
//       return res.status(500).json({ error: error.message || "Failed to generate questions" });
//     }
//   }

//   // ==========================================
//   //  HANDLE POST REQUEST (Evaluation - Optional)
//   // ==========================================
//   else if (req.method === 'POST') {
//      // If you need evaluation logic here, paste it. 
//      // Otherwise, strictly for generation, we only need GET.
//      return res.status(405).json({ message: 'Use GET for generation' });
//   } 
  
//   else {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
// }

import mongoose from "mongoose";

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
// SAFE JSON CLEANER
// ===============================
function cleanJSON(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

// ===============================
// API HANDLER
// ===============================
export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Use GET only" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "Missing OpenAI API Key" });

  await dbConnect();

  const { standard = "General", subject = "General Aptitude" } = req.query;

  const url = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `
You are an expert psychologist.
Return ONLY valid JSON array.
Never include markdown.
Never explain anything.
`;

  const userPrompt = `
Generate 20 Situation Reaction Test (SRT) MCQ questions in Marathi
for Class ${standard} (${subject}).

Each object must contain:
{
 "id": number,
 "question": string,
 "options": [string,string,string,string],
 "correctAnswer": string
}

If the response is cut, continue from where you stopped.
`;

  try {
    let fullText = "";
    let isComplete = false;

    let messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    // ===============================
    // AUTO CONTINUE LOOP
    // ===============================
    for (let i = 0; i < 6; i++) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-16k",
          messages,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const chunk = data.choices[0].message.content;

      fullText += "\n" + chunk;

      // Check if JSON array completed
      const open = (fullText.match(/\[/g) || []).length;
      const close = (fullText.match(/\]/g) || []).length;

      if (open > 0 && open === close) {
        isComplete = true;
        break;
      }

      // Ask model to continue
      messages.push({ role: "assistant", content: chunk });
      messages.push({
        role: "user",
        content: "Continue exactly from where you stopped. Do not repeat.",
      });
    }

    const cleaned = cleanJSON(fullText);
    const parsed = JSON.parse(cleaned);

    return res.status(200).json({ result: parsed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Generation failed",
      details: err.message,
    });
  }
}
