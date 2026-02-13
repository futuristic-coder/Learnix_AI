import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  BookOpen,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashcardService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSets, setFlashcardSets] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashcards = async () => {
    if (!documentId) {
      toast.error("Invalid document ID");
      return;
    }
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);


  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
  };

  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      // Update the card's lastReviewed property in the local state
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card, idx) =>
          idx === currentCardIndex
            ? { ...card, lastReviewed: new Date(), reviewCount: (card.reviewCount || 0) + 1 }
            : card
        )
      );
      toast.success("Flashcard reviewed!");
    } catch (error) {
      toast.error("Failed to review flashcard.");
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) =>
        prevFlashcards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card,
        ),
      );
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  };

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards(); // Refetch to show empty state
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
      setDeleting(false);
    }
  };

  const renderFlashcardContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No Flashcards Yet"
          description="Generate flashcards to start learning."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div className="space-y-6">
        <div className="flex justify-center">
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </Button>

          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-6 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl min-w-fit border border-slate-200 dark:border-slate-700">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            onClick={handleNextCard}
            variant="secondary"
            disabled={flashcards.length <= 1}
            className="flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link to={`/documents/${documentId}`} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Document
        </Link>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/30 p-4 sm:p-8 shadow-sm">
        {/* Animated Backgrounds */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-200/30 dark:bg-violet-900/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 shadow-lg">
              <Layers className="h-8 w-8 text-violet-700 dark:text-violet-300" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Flashcards
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                Review and master your learning materials
              </p>
              {!loading && flashcards.length > 0 && (
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur">
                    <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">{flashcards.length} Cards</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!loading && flashcards.length > 0 && (
            <Button
              variant="danger"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleting}
              className="flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Delete Set</span>
              <span className="sm:hidden">Delete</span>
            </Button>
          )}
        </div>
      </div>
      
      {renderFlashcardContent()}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
            <p className="text-slate-900 dark:text-slate-100 font-medium">
              Are you sure you want to delete this flashcard set? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteFlashcardSet} disabled={deleting} variant="danger">
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;
