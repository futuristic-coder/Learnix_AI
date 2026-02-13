import express from "express";
import https from "https";
import http from "http";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Custom auth middleware that accepts token from query or header
const authPDF = async (req, res, next) => {
  try {
    let token;

    // Get token from query string or Authorization header
    if (req.query.token) {
      token = req.query.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this resource",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this resource",
    });
  }
};

// @desc    Serve PDF for inline viewing
// @route   GET /api/pdf/view/:documentId
// @access  Private
router.get("/view/:documentId", authPDF, async (req, res) => {
  try {
    const Document = (await import("../models/Document.js")).default;
    const document = await Document.findOne({
      _id: req.params.documentId,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    const pdfUrl = document.filePath;

    // Download PDF from Cloudinary
    const client = pdfUrl.startsWith("https") ? https : http;

    client.get(pdfUrl, (response) => {
      if (response.statusCode !== 200) {
        return res.status(500).json({
          success: false,
          error: "Failed to fetch PDF",
        });
      }

      // Set proper headers for inline PDF viewing
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 1 day

      // Pipe the PDF to response
      response.pipe(res);
    }).on("error", (err) => {
      console.error("Error fetching PDF:", err);
      res.status(500).json({
        success: false,
        error: "Failed to load PDF",
      });
    });
  } catch (error) {
    console.error("PDF view error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;
