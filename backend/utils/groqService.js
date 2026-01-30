import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not set in environment variables");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generating flashcards from text
 * @param {string} text
 * @param {number} count
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcardsFromText = async (text, count = 10) => {
  const prompt = `Generate ${count} flashcards from the following text. Each flashcard should have a question, an answer, and a difficulty level (easy, medium, hard).

Format each flashcard as:
Q:[clear, specific question]
A:[concise answer]
D:[easy|medium|hard]

Separate each flashcard with "---".

Text:
${text.substring(0, 15000)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an educational assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    const generatedText = completion.choices[0].message.content;

    const flashcards = [];
    const cards = generatedText.split("---").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");
      let question = "",
        answer = "",
        difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) question = line.substring(2).trim();
        else if (line.startsWith("A:")) answer = line.substring(2).trim();
        else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) difficulty = diff;
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

/**
 * Generating quiz from text
 * @param {string} text
 * @param {number} numQuestions
 * @returns {Promise<Array>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate a quiz with ${numQuestions} multiple-choice questions from the following text.

Format each question as:
Q:[Question]
01:[Option 1]
02:[Option 2]
03:[Option 3]
04:[Option 4]
C:[Correct Option Number]
E:[Explanation]
D:[easy|medium|hard]

Separate each question with "---".

Text:
${text.substring(0, 15000)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an educational assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    const generatedText = completion.choices[0].message.content;

    const questions = [];
    const blocks = generatedText.split("---").filter((b) => b.trim());

    for (const block of blocks) {
      const lines = block.trim().split("\n");

      let question = "",
        options = [],
        correctAnswer = "",
        explanation = "",
        difficulty = "medium";

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("Q:")) question = trimmed.substring(2).trim();
        else if (/^0\d:/.test(trimmed)) options.push(trimmed.substring(3).trim());
        else if (trimmed.startsWith("C:")) correctAnswer = trimmed.substring(2).trim();
        else if (trimmed.startsWith("E:")) explanation = trimmed.substring(2).trim();
        else if (trimmed.startsWith("D:")) {
          const diff = trimmed.substring(2).trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff)) difficulty = diff;
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation,
          difficulty,
        });
      }
    }

    return questions.slice(0, numQuestions);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz");
  }
};

/**
 * Generate document summary
 * @param {string} text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {
  const prompt = `Provide a concise, well-structured summary of the following text.

Text:
${text.substring(0, 20000)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to generate summary");
  }
};

/**
 * Chat with document context
 * @param {string} question
 * @param {Array<Object>} chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `Based on the following document context, answer the question.
If the answer is not present, say so.

Context:
${context}

Question: ${question}
Answer:`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to process chat request");
  }
};

/**
 * Explain a specific concept
 * @param {string} concept
 * @param {string} context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
  const prompt = `Explain the concept of "${concept}" based on the following context.
Make it clear and educational, with examples if helpful.

Context:
${context.substring(0, 10000)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to explain concept");
  }
};
