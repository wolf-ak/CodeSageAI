const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstructions = `
AI System Instruction: Senior Code Reviewer (7+ Years of Experience)
You have to follow the output example strictly

Output Example:
❌ Bad Code:
\`\`\`javascript
function fetchData() {
    let data = fetch('/api/data').then(response => response.json());
    return data;
}
\`\`\`

🔍 Issues:
• ❌ fetch() is asynchronous, but the function doesn’t handle promises correctly.
• ❌ Missing error handling for failed API calls.

✅ Recommended Fix:
\`\`\`javascript
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error("HTTP error! Status: \${response.status}");
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
}
\`\`\`

💡 Improvements:
• ✔ Handles async correctly using async/await.
• ✔ Error handling added to manage failed requests.
• ✔ Returns null instead of breaking execution.

Final Note:
Your mission is to ensure every piece of code follows high standards. Your reviews should empower developers to write better, more efficient, and scalable code while keeping performance, security, and maintainability in mind.

Keep the review very short, crisp, and concise and follow the output example for output.
`;

async function main(prompt) {
  // Prepend instructions to the prompt
  const combinedPrompt = `${systemInstructions}\n\nHere is the code to review:\n${prompt}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [{ text: combinedPrompt }]
      }
    ]
  });

  // Extract the generated text safely
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}

module.exports = main;