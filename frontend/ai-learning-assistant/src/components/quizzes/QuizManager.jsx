import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesForDocument(documentId);
      console.log("Fetched quizzes:", data);
      setQuizzes(data.data);
    } catch (error) {
      toast.error("Failed to fetch quizzes.");
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("Quiz generated successfully!");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success(`${selectedQuiz.title || "Quiz"} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz.");
    } finally {
      setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Available"
          description="Generate quizzes based on the document content to test your knowledge."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id}
            quiz={quiz}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Library</h2>
            <p className="text-slate-600">Test your knowledge with AI-generated quizzes</p>
          </div>
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Generate Quiz
          </Button>
        </div>
        {renderQuizContent()}
      </div>

      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Math.max(1, parseInt(e.target.value || 1)))
              }
              min="1"
              max="20"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter number of questions"
              required
            />
            <p className="mt-2 text-sm text-slate-500">Choose between 1 and 20 questions</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={generating} className="flex-1">
              {generating ? "Generating..." : "Generate Quiz"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              {selectedQuiz?.title || "this quiz"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleting} className="flex-1" variant="danger">
              {deleting ? "Deleting..." : "Delete Quiz"}
            </Button>
          </div>
        </div>
      </Modal>
      </div>

  );
};

export default QuizManager;
