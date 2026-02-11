import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import Tabs from "../../components/common/Tabs";
import ChatInterface from "../../components/chats/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(`doc-tab-${id}`) || "Content";
  });

  // Save active tab to localStorage
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem(`doc-tab-${id}`, tabName);
  };

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error("Failed to fetch document details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);
  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    // If already a full URL (from Cloudinary or external), return as-is
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    // Fallback for relative paths (shouldn't happen with Cloudinary, but kept for safety)
    const baseUrl = process.env.REACT_APP_API_URL || "https://learnix-ai-backend.onrender.com";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (!document || !document.data || !document.data.filePath) {
      return <div className="text-sm text-slate-500">PDF not available.</div>;
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Document Viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <ExternalLink size={16} />
            Open PDF in new tab
          </a>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh]"
            title="Document PDF Viewer"
            frameBorder="0"
            style={{ colorScheme: "light" }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface documentId={id} />;
  };

  const renderAIActions = () => {
    return <AIActions />
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />;
  };

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />;
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    { name: "AI Actions", label: "AI Actions", content: renderAIActions() },
    { name: "Flashcards", label: "Flashcards", content: renderFlashcardsTab() },
    { name: "Quizzes", label: "Quizzes", content: renderQuizzesTab() },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!document) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">Document not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Animated background blobs */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20 animate-pulse" />
      <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20 animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="space-y-6 relative z-10">
        {/* Back Button */}
        <Link to="/documents" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-400 group transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Documents
        </Link>

        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 backdrop-blur p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 blur-3xl dark:from-indigo-600/20 dark:to-violet-600/20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 px-4 py-2 border border-indigo-200/50 dark:border-indigo-800/50 mb-4">
              <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></div>
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">DOCUMENT</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 shadow-lg">
                <FileText className="h-8 w-8 text-indigo-700 dark:text-indigo-300" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-1">
                  {document.data.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm md:text-base">Explore content, create flashcards, and take quizzes</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default DocumentDetailPage;
