import { ResumeData } from "../types";

// The user provided a Groq API Key (starts with gsk_), so we use the Groq API endpoint.
const API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// UPDATED: llama3-8b-8192 is decommissioned. 
// Using llama-3.1-8b-instant which is the current supported version.
const MODEL_NAME = "llama-3.1-8b-instant"; 

const callGroqApi = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      mode: 'cors', // Explicitly request CORS to allow browser-to-server communication
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048, // Increased for longer interview prep responses
      }),
    });

    if (!response.ok) {
      // Try to parse error details, but handle cases where response isn't JSON
      let errorMsg = response.statusText;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error?.message || errorMsg;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(`Groq API Error: ${response.status} - ${errorMsg}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

export const generateProfessionalSummary = async (data: ResumeData): Promise<string> => {
  const systemPrompt = "You are an expert resume writer. Write a professional executive summary.";
  const userPrompt = `
    Write a compelling, professional executive summary (max 3-4 sentences) for a resume.
    
    Candidate Name: ${data.fullName}
    Target Job Title: ${data.targetJobTitle}
    Key Skills: ${data.skills}
    Years of Experience: ${data.experience.length > 0 ? 'Experienced' : 'Entry Level'}
    
    Rules:
    - Use active voice and strong action verbs.
    - Tailor it specifically for the '${data.targetJobTitle}' role.
    - Do not use personal pronouns like "I" or "My" (implied first person).
    - Focus on professional value and achievements.
    - Return ONLY the summary text.
  `;

  return callGroqApi(systemPrompt, userPrompt);
};

export const optimizeWorkDescription = async (role: string, rawDescription: string): Promise<string> => {
  const systemPrompt = "You are an expert ATS optimization specialist.";
  const userPrompt = `
    Rewrite the following job description bullet points to be professional, results-oriented, and ATS-friendly.
    
    Job Role: ${role}
    Input Text: "${rawDescription}"
    
    Rules:
    - Start each bullet with a strong action verb (e.g., Spearheaded, Engineered, Optimized).
    - Quantify results where possible (add placeholders like [X]% if numbers are missing).
    - Keep formatting as a bulleted list (using • ).
    - Improve clarity and impact.
    - Return ONLY the bullet points.
  `;

  return callGroqApi(systemPrompt, userPrompt);
};

export const optimizeProjectDescription = async (name: string, techStack: string, rawDescription: string): Promise<string> => {
  const systemPrompt = "You are a senior technical recruiter optimizing resume content.";
  const userPrompt = `
    Polish and enhance the following project description for a resume.
    
    Project Name: ${name}
    Tech Stack: ${techStack}
    Input Description: "${rawDescription}"
    
    Rules:
    - Highlight technical challenges and specific solutions.
    - Naturally weave in the technologies used.
    - Keep it concise (2-3 sentences or bullet points).
    - Use impressive, professional language.
    - Return ONLY the description text.
  `;

  return callGroqApi(systemPrompt, userPrompt);
};

export const suggestSkills = async (jobTitle: string): Promise<string> => {
  const systemPrompt = "You are a career coach.";
  const userPrompt = `
    List the top 10 most relevant hard and soft skills for the job title: "${jobTitle}".
    Return ONLY a single comma-separated string of skills.
    Example: JavaScript, React, Team Leadership, Agile Methodology
    
    Do not add any introductory text or labels. Just the comma-separated list.
  `;

  return callGroqApi(systemPrompt, userPrompt);
};

export const generateInterviewQuestions = async (jobTitle: string, skills: string, summary: string): Promise<string> => {
  const systemPrompt = "You are an expert technical recruiter and interview coach.";
  const userPrompt = `
    Prepare a candidate for a job interview.
    
    Target Role: ${jobTitle}
    Key Skills: ${skills}
    Professional Summary: ${summary}
    
    Generate:
    1. 3 Common Behavioral Questions
    2. 3 Technical/Role-Specific Questions
    
    For each question, provide:
    - The Question
    - "Pro Tip": A brief insight on what the interviewer is looking for.
    - "Key Talking Points": Bullet points on what to mention.
    
    Format the output clearly using headings, bold text (using **stars**), and bullet points. 
    Make it encouraging and actionable.
  `;

  return callGroqApi(systemPrompt, userPrompt);
};
