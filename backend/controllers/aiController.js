import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js";
import * as groqService from "../utils/groqService.js";
import { findRelevantChunks } from "../utils/textChunker.js";

// @desc    Generate flashcards from document
// @route   POST /api/ai/generate-flashcards
// @access  Private
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Document ID is required",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not processed yet",
        statusCode: 404,
      });
    }

    const cards = await groqService.generateFlashcardsFromText(
      document.extractedText,
      parseInt(count),
    );
    const flashcardSet = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });
    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate quiz from document
// @route   POST /api/ai/generate-quiz
// @access  Private
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Document ID is required",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not processed yet",
        statusCode: 404,
      });
    }
    const questions = await groqService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions),
    );
    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `Quiz for ${document.title}`,
      questions: questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });
    res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate document summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Document ID is required",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not processed yet",
        statusCode: 404,
      });
    }
    const summary = await groqService.generateSummary(document.extractedText);
    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary,
      },
      message: "Summary generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Chat with document
// @route   POST /api/ai/chat
// @access  Private
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question) {
        return res.status(400).json({
        success: false,
        error: "Document ID and question are required",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
        status: "ready",
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not processed yet",
        statusCode: 404,
      });
    }

    const relevantChunks = findRelevantChunks(
      document.chunk,question, 3);
    const chunkIndices= relevantChunks.map(c=>c.chunkIndex);

    let chatHistory= await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    });
    if(!chatHistory){
      chatHistory= await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: [],
      });
    }
    const answer = await groqService.chatWithContext(question, relevantChunks);

    chatHistory.messages.push(
      { role: "user", content: question,timestamp:new Date(), relevantChunks:[] },
      { role: "assistant", content: answer, timestamp:new Date(), relevantChunks: chunkIndices },
    );
    await chatHistory.save();
    res.status(200).json({
        success: true,
        data: { question,answer,relevantChunks: chunkIndices, chatHistoryId: chatHistory._id },
        message: "Chat response generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explain concept from document
// @route   POST /api/ai/explain-concept
// @access  Private
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;
    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: "Document ID and concept are required",
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: "ready",
    });
    if (!document) {
        return res.status(404).json({
        success: false,
        error: "Document not found or not processed yet",
        statusCode: 404,
      });
    }

    const relevantChunks = findRelevantChunks(
      document.chunk,concept, 5);
    const context=relevantChunks.map(c=>c.content).join("\n\n");

    const explanation = await groqService.explainConcept(
        concept,
        context
    );
    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c=>c.chunkIndex),
      },
      message: "Concept explained successfully",
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for a document
// @route   GET /api/ai/chat-history/:documentId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    if(!documentId){
        return res.status(400).json({
        success: false,
        error: "Document ID is required",
        statusCode: 400,
      });
    }
    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId,
    }).select('messages');

    if (!chatHistory) {
      return res.status(200).json({
        success: true,
        data: [],
        error: "Chat history not found for this document",
      });
    }
    res.status(200).json({
      success: true,
      data: chatHistory.messages,
      message: "Chat history retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
