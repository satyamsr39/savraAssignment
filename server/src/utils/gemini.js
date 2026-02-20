const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

async function generateText(prompt) {

  const response =
    await ai.models.generateContent({
      model: "gemini-2.0-flash",

      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })

  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text

  console.log("Gemini Output:", text)

  return text || "No AI insight generated"
}

module.exports = generateText
