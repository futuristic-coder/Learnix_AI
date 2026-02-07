import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService";
import { useAuth } from "../../context/AuthContent";
import Spinner from "../../components/common/Spinner";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";

const ChatInterface = ({ documentId: propDocumentId }) => {
  const { id: paramDocumentId } = useParams();
  const documentId = propDocumentId || paramDocumentId;
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const messages = await aiService.getChatHistory(documentId);
        // Backend returns array of messages directly
        setHistory(Array.isArray(messages) ? messages : []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setHistory([]);
      } finally {
        setInitialLoading(false);
      }
    };

    if (documentId) {
      fetchChatHistory();
    } else {
      setInitialLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setHistory((prevHistory) => [...prevHistory, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.sendMessage(
        documentId,
        userMessage.content,
      );
      const assistantMessage = {
        role: "assistant",
        content: response?.data?.answer || response?.answer || "No response received.",
        timestamp: new Date(),
        relevantChunks: response?.data?.relevantChunks || response?.relevantChunks || [],
      };
      setHistory((prevHistory) => [...prevHistory, assistantMessage]);
      
      // Refetch chat history to ensure persistence across reloads
      try {
        const messages = await aiService.getChatHistory(documentId);
        setHistory(Array.isArray(messages) ? messages : []);
      } catch (error) {
        console.error("Failed to refetch chat history:", error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
        timestamp: new Date(),
      };
      setHistory((prevHistory) => [...prevHistory, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";
    return (
      <div
        key={index}
        className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <div className="flex-shrink-0 mr-3">
            <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          </div>
        )}
        <div
          className={`max-w-[70%] p-4 rounded-2xl ${isUser ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"}`}
        >
          {isUser ? (
            <p>{msg.content}</p>
          ) : (
            <div>
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
        {isUser && (
          <div className="flex-shrink-0 ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mb-4">
          <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-20rem)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 mb-6">
              <MessageSquare className="h-10 w-10 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Start a conversation</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">Ask me anything about your documents.</p>
          </div>
        ) : (
          history.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="mb-6 flex justify-start">
            <div className="flex-shrink-0 mr-3">
              <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <div className="max-w-[70%] p-4 rounded-2xl bg-slate-100">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
