const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sends a prompt and returns parsed JSON. Gemini is told to answer in JSON only.
async function askJSON(prompt) {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json', temperature: 0.6 }
  });
  try {
    const out = await model.generateContent(prompt);
    return JSON.parse(out.response.text());
  } catch (e) {
    const err = new Error('The AI service could not complete that request. Try again in a moment.');
    err.status = 502;
    console.error('Gemini error:', e.message);
    throw err;
  }
}
module.exports = { askJSON };
