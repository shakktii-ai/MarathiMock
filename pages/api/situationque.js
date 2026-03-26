
// import mongoose from "mongoose";
// // DATABASE CONNECTION
// const MONGODB_URI = process.env.MONGODB_URI;

// let cached = global.mongoose || { conn: null, promise: null };
// global.mongoose = cached;

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// // ===============================
// // SAFE JSON CLEANER
// // ===============================
// function cleanJSON(text) {
//   return text
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();
// }

// // ===============================
// // API HANDLER
// // ===============================
// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Use GET only" });
//   }

//   const apiKey = process.env.OPENAI_API_KEY;
//   if (!apiKey) {
//     return res.status(500).json({ error: "Missing OpenAI API Key" });
//   }

//   await dbConnect();

//   const url = "https://api.openai.com/v1/chat/completions";

//   const systemPrompt = `
// You are an expert industrial behavioural assessment designer specializing in shop-floor workers in Indian factories.
// Uniqueness constraints:
// - 
// - Every scenario must be completely different.
// - Do NOT repeat scenario themes.
// - Avoid repeating patterns like:
//   coworker mistake
//   new worker
//   machine noise
//   asking supervisor
// - Each scenario must represent a different shop-floor situation.
// Return ONLY strict valid JSON.
// Do NOT include markdown.
// Do NOT include explanations.
// Do NOT include headings.
// Do NOT include any text outside JSON.
// `;

//  const userPrompt = `
// Generate exactly 25 situational judgement questions in Marathi for Indian factory workers.

// Language rules:
// - Use natural spoken Marathi used on factory shop floors.
// - Avoid overly formal Marathi.

// Design rules:
// - Each item must describe a realistic shop-floor situation.
// - Hide the behavioural intent.
// - Avoid direct personality questions.
// - Avoid using these words: honesty, ethics, safety rule, respect, bias, harassment.
// - All 4 options must sound plausible.

// Engine distribution (must be exact):
// A:4 items
// B:3 items
// C:3 items
// D:4 items
// E:3 items
// F:4 items
// G:4 items

// Each item must contain the following fields:
// - id (1–25)
// - engine (A,B,C,D,E,F,G)
// - sub_parameter
// - scenario
// - options
// - hidden_measure

// Formatting rules:
// - scenario: maximum 60 words
// - each option: maximum 18 words
// - hidden_measure: maximum 5 words

// Options must follow this structure:

// "options": {
//   "A": "option text",
//   "B": "option text",
//   "C": "option text",
//   "D": "option text"
// }

// Output format must be exactly:

// {
//   "questions": [
//     {
//       "id": 1,
//       "engine": "A",
//       "sub_parameter": "",
//       "scenario": "",
//       "options": {
//         "A": "",
//         "B": "",
//         "C": "",
//         "D": ""
//       },
//       "hidden_measure": ""
//     }
//   ]
// }

// Return valid JSON only.
// `;

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         temperature: 0.7,
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//       }),
//     });

//     const data = await response.json();

//     const content = data?.choices?.[0]?.message?.content;
//     if (!content) {
//       return res.status(500).json({
//         error: "AI did not return content",
//         raw: data,
//       });
//     }

//     const cleaned = cleanJSON(content);
//     const parsed = JSON.parse(cleaned);

//     return res.status(200).json({ result: parsed });

//   } catch (err) {
//     console.error("Situation generation failed:", err);
//     return res.status(500).json({
//       error: "Situation generation failed",
//       details: err.message,
//     });
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


// shuffle options
function shuffleOptions(questions) {
  return questions.map((q) => {
    const correct = q.correctAnswer;
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: shuffled,
      correctAnswer: correct,
    };
  });
}


// ===============================
// API HANDLER
// ===============================
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Use GET only" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OpenAI API Key" });
  }

  await dbConnect();
  const { subject = "Printed Circuit Board" } = req.query;

  const subjectContext = subject.toLowerCase().includes("auto") || subject.toLowerCase().includes("aao")
    ? {
      tradeName: "Automotive Assembly Operator (AAO)",
      locations: "engine assembly shop, vehicle workshop, garage floor, parts store",
      tools: "torque wrench, engine components, assembly tools, vehicle parts, hydraulic jack",
      scenarios: "engine assembly mistake, wrong torque setting, missing part, oil spill safety, vehicle inspection defect"
    }
    : {
      tradeName: "Printed Circuit Board (PCB)",
      locations: "PCB assembly line, soldering station, electronics workshop, testing bench",
      tools: "soldering iron, multimeter, PCB board, electronic components, continuity tester",
      scenarios: "soldering defect, component placed wrongly, short circuit risk, testing failure, ESD safety violation"
    };

  const url = "https://api.openai.com/v1/chat/completions";


  const systemPrompt = `
You are a senior ITI behavioural assessment designer specializing in Situational Judgement Tests (SJT) for Indian blue collar workers in manufacturing and workshop environments.

Return ONLY a valid JSON array.
Do NOT include markdown, explanations, headings, or any text outside JSON.

═══ TRADE CONTEXT ═══
This assessment is for: ${subjectContext.tradeName}
All scenarios MUST be specific to this trade only.
Locations to use: ${subjectContext.locations}
Tools and equipment to mention: ${subjectContext.tools}
Relevant work scenarios: ${subjectContext.scenarios}

═══ LANGUAGE RULES — MOST IMPORTANT ═══
- Write ALL words in Marathi only — no English words in questions or options.
- ONLY these short technical abbreviations can stay in English: PCB, ESD, SOP, AAO, RPM, DC, AC, QC, ITI.
- ALL other words must be in Marathi. Use these translations:
  soldering defect → सोल्डरिंग दोष
  assembly line → असेंब्ली लाईन
  safety rules → सुरक्षा नियम
  breakdown → बिघाड
  production → उत्पादन
  quality → गुणवत्ता
  defect → दोष
  machine → मशीन
  tool → साधन
  workshop → कार्यशाळा
  shift → शिफ्ट
  supervisor → सुपरवायझर
  soldering iron → सोल्डरिंग आयरन
  torque wrench → टॉर्क रेंच
  safety gear → सुरक्षा साधने
  component → घटक
  circuit → सर्किट
  testing → तपासणी
  report → अहवाल
  repair → दुरुस्ती

═══ SCENARIO RULES ═══
- Exactly 10 questions, each from a DIFFERENT shop floor or workshop context:
  1. Machine or equipment breakdown during production shift
  2. Supervisor giving unclear or wrong instructions
  3. Safety rule being ignored by a colleague
  4. Quality defect found in your own work
  5. Conflict with a senior worker on the shop floor
  6. Production target pressure with less manpower
  7. New machine or tool learning situation
  8. Workplace near-miss accident
  9. Colleague not following SOP
  10. Overtime or shift change dispute

- Scenario length: minimum 3 sentences, maximum 5 sentences.
- Scenarios must be realistic — do not create false urgency or impossible situations.
- The situation must be something that genuinely happens on a shop floor daily.
- Make the situation feel real — use names like रमेश, सुरेश, प्रिया, राजू.
- ONLY use locations and tools relevant to ${subjectContext.tradeName}.
- The behavioural trait being tested must NEVER be mentioned in the question.
- No two questions can have the same scenario — all 10 must be completely different.
- Each question must have minimum 3 sentences before "तुम्ही काय कराल?"
- Every question MUST end with exactly this sentence: "तुम्ही काय कराल?"
- This must be the very last sentence of every question — no exceptions.

═══ REALISM RULES ═══
- Do NOT say "उत्पादन थांबवायचं आहे" unless it is genuinely required in the situation.
- Do NOT create scenarios where the entire production line stops for a minor issue.
- A broken tool → inform supervisor and find alternative, NOT stop entire production.
- A quality defect → report to supervisor, NOT shutdown the factory.
- A safety violation → warn the colleague and inform supervisor, NOT call HR immediately.
- Keep situations proportional — small problems have small responses, big problems have big responses.

═══ OPTION RULES ═══
- Exactly 4 options per question.
- Each option must represent a DIFFERENT decision strategy:
  Option 1 → Assertive & safety/process-following
  Option 2 → Passive & avoidant
  Option 3 → Collaborative & team-oriented
  Option 4 → Impulsive & self-focused
- No two options can have similar meaning — even slightly.
- Option lengths must vary — do NOT make all options the same length.
- NEVER use "वरीलपैकी सर्व", "All of the above", "None of the above".
- Use simple spoken Marathi — NOT formal or office language.
- ALL option text must be in Marathi — no English words except allowed abbreviations.
- Options must be realistic responses — no extreme actions for minor problems.

═══ CORRECTANSWER RULES ═══
- correctAnswer must be the professionally sound, safe and ethical choice.
- correctAnswer must match one of the 4 options EXACTLY — character for character.
- correctAnswer should always be proportional to the situation — calm and process-following.

═══ DIMENSION COVERAGE ═══
Each question must test a DIFFERENT dimension — no repeats:
Q1: Safety Awareness
Q2: SOP Compliance
Q3: Accountability
Q4: Teamwork
Q5: Respect for Authority
Q6: Work Ethics
Q7: Problem Solving
Q8: Adaptability
Q9: Conflict Resolution
Q10: Initiative
`;

  const userPrompt = `
Generate exactly 10 Marathi ITI shop floor SJT questions for ${subjectContext.tradeName} trade following all system rules.

All questions MUST be specific to ${subjectContext.tradeName} — use relevant tools, locations and work scenarios for this trade only.

CRITICAL CHECKS before generating each question:
- Is every word in Marathi? (except PCB, ESD, SOP, AAO, RPM, DC, AC, QC)
- Is the scenario at least 3 sentences long?
- Is this scenario different from all other 9 questions?
- Is the situation realistic and proportional?
- Does it end with "तुम्ही काय कराल?"

Here is one example of a perfect question for ${subjectContext.tradeName}:

${subjectContext.tradeName.includes("Auto") ? `
{
  "id": 1,
  "question": "तुम्ही इंजिन असेंब्ली शॉपमध्ये सिलिंडर हेड बसवत असताना तुमच्या लक्षात आले की टॉर्क रेंच व्यवस्थित काम करत नाही. रमेश सुपरवायझर जवळच दुसऱ्या कामगाराशी बोलत आहे. जर चुकीच्या टॉर्कने काम झाले तर इंजिनमध्ये दोष येऊ शकतो. तुम्ही काय कराल?",
  "options": [
    "रमेश सुपरवायझरला लगेच सांगा की टॉर्क रेंच व्यवस्थित काम करत नाही आणि दुसरे साधन मागवा",
    "काही बोलू नका, अंदाजाने काम पूर्ण करा",
    "टीममधील अनुभवी सहकाऱ्याला विचारा की हे साधन आधी व्यवस्थित होते का",
    "तो भाग बाजूला ठेवा आणि दुसरे काम सुरू करा"
  ],
  "correctAnswer": "रमेश सुपरवायझरला लगेच सांगा की टॉर्क रेंच व्यवस्थित काम करत नाही आणि दुसरे साधन मागवा"
}` : `
{
  "id": 1,
  "question": "तुम्ही PCB असेंब्ली लाईनवर सोल्डरिंग करत असताना तुमचे सोल्डरिंग आयरन अचानक बंद झाले. सुपरवायझर जवळच दुसऱ्या कामगाराशी बोलत आहे. तुमच्या बाजूला spare सोल्डरिंग आयरन नाही. तुम्ही काय कराल?",
  "options": [
    "सुपरवायझरला शांतपणे सांगा की सोल्डरिंग आयरन बंद झाले आहे आणि दुसरे मागवा",
    "काही बोलू नका, थोड्या वेळाने परत चालू होईल असे वाटते",
    "शेजारच्या सहकाऱ्याला विचारा की त्याच्याकडे spare आयरन आहे का",
    "लगेच उत्पादन सुपरवायझरला फोन करा आणि लाईन बंद करायला सांगा"
  ],
  "correctAnswer": "सुपरवायझरला शांतपणे सांगा की सोल्डरिंग आयरन बंद झाले आहे आणि दुसरे मागवा"
}`}

Now generate all 10 questions in this format:

[
  {
    "id": 1,
    "question": "Marathi scenario minimum 3 sentences ending with तुम्ही काय कराल?",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "Exact matching option text"
  }
]
`;

  try {
    const response = await fetch(url, {
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
    if (!content) {
      return res.status(500).json({
        error: "AI did not return content",
        raw: data,
      });
    }

    const cleaned = cleanJSON(content);
    console.log("cleaned", cleaned);

    const parsed = JSON.parse(cleaned);
    const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || []);
    const shuffled = shuffleOptions(questionsArray);
    return res.status(200).json({ result: shuffled });


  } catch (err) {
    console.error("Situation generation failed:", err);
    return res.status(500).json({
      error: "Situation generation failed",
      details: err.message,
    });
  }
}