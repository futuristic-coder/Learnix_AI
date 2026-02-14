# 📚 Learnix AI - Intelligent Learning Assistant

> A modern, full-stack AI-powered learning platform that transforms educational content into interactive learning experiences.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas/Local-13AA52?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Available Scripts](#-available-scripts)
- [API Routes](#-api-routes)
- [Architecture](#-architecture)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## Overview

Learnix AI is a comprehensive learning platform that combines document management, spaced repetition flashcards, intelligent quizzing, and AI-powered chat to create a personalized educational experience. Whether you're a student preparing for exams or a professional upskilling in new areas, Learnix AI adapts to your learning style and pace.

### Key Highlights

- 🤖 **AI-Powered Learning** - Get instant explanations and generate study materials from any document
- 📄 **Smart Document Processing** - Upload PDFs, extract content, and organize learning materials
- 🎴 **Spaced Repetition** - Automatically generated and customizable flashcards for optimal retention
- 🧪 **Intelligent Quizzes** - Adaptive quizzes that adjust difficulty based on performance
- 📊 **Progress Tracking** - Detailed analytics and progress visualizations
- 🔐 **Secure Authentication** - User accounts with encrypted credentials

## 🚀 Features

### Authentication & User Management
- User registration and login with JWT-based authentication
- Secure password handling with bcrypt hashing
- User profile management and progress tracking

### Document Management
- PDF upload and processing
- Automatic text extraction from documents
- Intelligent chunking for better context handling
- Document organization and categorization
- Integration with cloud storage (Cloudinary)

### AI Integration
- Powered by Groq API for fast AI responses
- Context-aware chat interface
- Automatic flashcard generation from documents
- Smart quiz generation with diverse question types
- Real-time AI suggestions and explanations

### Learning Tools
- **Flashcards**: Create, review, and track flashcard sets with progress metrics
- **Quizzes**: Test knowledge with multiple-choice and essay questions
- **Chat**: Interactive Q&A with AI assistant for document clarification
- **Progress Dashboard**: Visual tracking of learning metrics

### Frontend Experience
- Responsive, modern UI built with React and Tailwind CSS
- Dark mode support with theme context
- Intuitive navigation and user flows
- Component-based architecture for maintainability

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js (18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **AI**: Groq API integration
- **File Storage**: Cloudinary
- **PDF Processing**: Custom PDF parser
- **Deployment**: Render

### Frontend
- **Library**: React 18+ with Vite bundler
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios with custom interceptors
- **Build Tool**: Vite for fast development

## 📁 Project Structure

```
AiLearningAssistant/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.js    # Cloud storage setup
│   │   ├── db.js            # MongoDB connection
│   │   └── multer.js        # File upload middleware
│   ├── controllers/         # Business logic for routes
│   ├── middleware/          # Custom middleware (auth, error handling)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── utils/               # Helper utilities
│   │   ├── groqService.js   # AI service integration
│   │   ├── pdfParser.js     # PDF extraction
│   │   └── textChunker.js   # Content chunking
│   ├── uploads/             # Local file storage
│   ├── server.js            # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── pages/           # Page-level components
    │   ├── services/        # API service layer
    │   ├── context/         # Context providers (Auth, Theme)
    │   ├── utils/           # Helper functions
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/              # Static assets
    ├── vite.config.js       # Vite configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** for version control
- API keys for:
  - Groq API (free tier available at [console.groq.com](https://console.groq.com))
  - Cloudinary (free tier at [cloudinary.com](https://cloudinary.com))

### Quick Start

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd AiLearningAssistant
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (see [Environment Setup](#-environment-setup) section) and configure:
```bash
npm run dev
```

The backend API will be available at `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📋 Environment Setup

### Backend Environment Variables (`.env`)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ailearning?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_EXPIRY=7d

# AI Service (Groq)
GROQ_API_KEY=your_groq_api_key_here

# Cloud Storage (Cloudinary)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables (`.env.local`)

Create a `.env.local` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Learnix AI
```

## 📚 Available Scripts

### Backend

```bash
# Development - Start with auto-reload
npm run dev

# Production - Start server
npm start

# Run linter (if configured)
npm run lint
```

### Frontend

```bash
# Development - Start Vite dev server with HMR
npm run dev

# Build - Create optimized production bundle
npm run build

# Preview - Test production build locally
npm run preview

# Lint - Check code quality
npm run lint
```

## 🔌 API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - Login and get JWT token
- `POST /logout` - Logout user
- `GET /profile` - Get current user profile

### Document Routes (`/api/documents`)
- `GET /` - List all documents
- `POST /` - Upload new document
- `GET /:id` - Get document details
- `PUT /:id` - Update document
- `DELETE /:id` - Delete document

### Flashcard Routes (`/api/flashcards`)
- `GET /` - List all flashcard sets
- `POST /` - Create new flashcard set
- `GET /:id` - Get flashcard set details
- `PUT /:id` - Update flashcard set
- `DELETE /:id` - Delete flashcard set

### Quiz Routes (`/api/quizzes`)
- `GET /` - List all quizzes
- `POST /` - Create new quiz
- `GET /:id` - Get quiz details with questions
- `POST /:id/submit` - Submit quiz answers

### AI Routes (`/api/ai`)
- `POST /chat` - Send message to AI assistant
- `POST /generate-flashcards` - Generate flashcards from document
- `POST /generate-quiz` - Create quiz from document content

### Progress Routes (`/api/progress`)
- `GET /` - Get user learning progress
- `GET /stats` - Get detailed learning statistics
- `POST /update` - Update progress metrics

## 🏗 Architecture

### Data Flow

```
User → Frontend (React) 
  ↓
API Client (Axios) 
  ↓
Backend (Express) 
  ↓
Database (MongoDB) / External APIs (Groq, Cloudinary)
  ↓
Response back to Frontend
```

### Authentication Flow

```
1. User Registration/Login
   ↓
2. JWT Token Generated (bcrypt hash validation)
   ↓
3. Token Stored in Frontend (localStorage/sessionStorage)
   ↓
4. Token Sent in Request Headers (Authorization: Bearer <token>)
   ↓
5. Auth Middleware Validates Token
   ↓
6. Request Proceeds or Returns 401/403
```

### AI Processing Flow

```
Document Upload 
  ↓
PDF Parsing & Text Extraction
  ↓
Content Chunking (for context)
  ↓
Groq API Processing
  ↓
Generate Flashcards/Quiz/Chat Responses
  ↓
Store Results in Database
```

## 🌐 Deployment

The application is configured for deployment on **Render.com**

### Backend Deployment
- Platform: Render Web Service
- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node
- See `render.yaml` for configuration

### Frontend Deployment
- Platform: Vercel
- Build Command: `npm run build`
- Output Directory: `dist`
- See `vercel.json` for configuration

## 🐛 Troubleshooting

### Common Issues

**API Connection Failed**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env.local`
- Verify CORS is enabled in Express config

**Database Connection Error**
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas IP whitelist includes your IP
- For local MongoDB, ensure it's running: `mongod`

**AI Responses Not Working**
- Validate `GROQ_API_KEY` is correct and active
- Check API rate limits on Groq dashboard
- Verify document content is being extracted properly

**File Upload Issues**
- Verify Cloudinary credentials are correct
- Check file size limits in multer configuration
- Ensure uploads folder has write permissions

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node version: `node --version` (should be 18+)

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes before submitting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation and troubleshooting section

---

**Happy Learning! 🎓**
