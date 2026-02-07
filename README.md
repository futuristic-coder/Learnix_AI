# project name

A full-stack AI learning assistant with a Node/Express backend and a React (Vite) frontend. The backend serves APIs for authentication, documents, flashcards, quizzes, progress tracking, and AI features. The frontend provides the UI for learning workflows.

## Features

- Auth flows (register/login)
- Document upload and parsing
- AI-assisted chat/actions
- Flashcards and quizzes
- Progress tracking

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Frontend: React, Vite, Tailwind CSS

## Project Structure

- backend/ - API server, routes, controllers, models, and utilities
- frontend/ - React UI, components, pages, and services

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- npm
- MongoDB instance (local or hosted)

### Backend

```bash
cd backend
npm install
npm run dev
```

The API server runs on port 8000 by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server prints the local URL in the terminal (usually http://localhost:5173).

## Available Scripts

### Backend

- `npm run dev` - start server with nodemon
- `npm start` - start server

### Frontend

- `npm run dev` - start Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Notes

- Configure environment variables in backend/.env (e.g., database connection, API keys). See the codebase for the exact variable names.
