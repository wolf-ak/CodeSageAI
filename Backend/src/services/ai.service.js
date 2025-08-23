const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    // Add system instruction here:
    system_instruction: {
      parts: [{ text: `
        You are a code reviewer, who have an expertise in development.
        You analyze the code and find the problems and suggest the solution to the developer.

        You always try to find the best solution for the developer and also try to make the code more efficient and clean.

        ` }]
    }
  });

  // Extract the generated text safely
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}

module.exports = main;