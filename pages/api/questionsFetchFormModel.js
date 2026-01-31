/**
 * API endpoint for generating academic questions using OpenAI's GPT-4 model
 * Questions are generated in Marathi based on the provided academic parameters
 */



export const config = {
  runtime: 'nodejs',
  maxDuration: 300,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { level, subject, role, board } = req.body;

  if ((!level) && (!role || !subject || !board)) {
    return res.status(400).json({ error: 'Role, Subject, board and level are required.' });
  }

  try {
    const questions = await generateQuestionsWithOpenAI(level, role, board, subject);

    if (questions) {
      return res.status(200).json({
        message: 'Questions generated successfully.',
        questions,
      });
    } else {
      return res.status(500).json({ error: 'Failed to generate questions.' });
    }
  } catch (error) {
    console.error('Error during processing:', error);
    return res.status(500).json({ 
      error: 'Error during question generation.',
      details: error.message 
    });
  }
}

async function generateQuestionsWithOpenAI(level, role, board, subject) {
  const openaiUrl = 'https://api.openai.com/v1/chat/completions';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  };

  const systemPrompt = `
You are a professional technical interviewer for entry-level industrial jobs.
You strictly generate role-specific interview questions in Marathi.
You NEVER generate school, mathematics, or academic syllabus questions.
`;

const userPrompt = `
Generate 10 job-role-specific interview questions in Marathi based on the details below.

Role: ${role}
Subject: ${subject}
Difficulty Level: ${level}

STRICT RULES (VERY IMPORTANT):
- This is NOT a school or college exam.
- Do NOT generate mathematics, science, or textbook questions.
- Questions must be suitable for job interviews only.

ROLE-SPECIFIC INSTRUCTIONS:

If Role is PCB (Printed Circuit Board):
- Ask ONLY about:
  - PCB basics
  - Electronic components
  - Soldering, SMT, through-hole technology
  - PCB manufacturing, inspection, and safety
  - Basic electronics used in industry

If Role is AAO (Automotive Assembly Operator):
- Ask ONLY about:
  - Assembly line work
  - Automotive parts and tools
  - Safety procedures and PPE
  - Quality checks
  - Teamwork, discipline, and SOPs

FORMATTING RULES:
- Write ALL questions in Marathi only.
- Use Marathi numerals (१, २, ३, …).
- Each question must have 2–3 full sentences.
- Use interview-style wording like:
  “समजावून सांगा”, “कसे कराल”, “तुमचा अनुभव सांगा”, “काय काळजी घ्याल”.
- Do NOT include answers, hints, headings, markdown, or extra text.
- Output ONLY a clean numbered list of questions.
`;

  const requestBody = {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1000
  };

  try {
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}