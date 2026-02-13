import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// Test Groq API connection
router.get("/test-groq", (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY not found in environment",
        hasKey: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "GROQ_API_KEY is set",
      keyPrefix: apiKey.substring(0, 10) + "...",
      hasKey: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Test actual Groq API call
router.post("/test-groq-api", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GROQ_API_KEY not set",
      });
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: "Say hello in one word" },
      ],
      temperature: 0.1,
    });

    return res.status(200).json({
      success: true,
      message: "Groq API is working",
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API test error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type,
    });
  }
});

export default router;
