import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { Book, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();
  const handleStudyNow = () => {
    const docId = typeof flashcardSet.documentId === 'string' 
      ? flashcardSet.documentId 
      : flashcardSet.documentId?._id;
    navigate(`/documents/${docId}/flashcards`);
  };

  const reviewedCount = flashcardSet.cards.filter(
    (card) => card.lastReviewed,
  ).length;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;

  return (
    <div onClick={handleStudyNow} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all p-6 cursor-pointer h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition flex-shrink-0">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 title={flashcardSet?.documentId?.title} className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
              {flashcardSet?.documentId?.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Created {moment(flashcardSet.createdAt).fromNow()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {totalCards} {totalCards === 1 ? "Card" : "Cards"}
            </span>
            {reviewedCount > 0 && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                <TrendingUp size={14} strokeWidth={2.5} />
                <span>{progressPercentage}% Reviewed</span>
              </div>
            )}
          </div>

          {totalCards > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">Progress</span>
                <span className="font-semibold">
                  {reviewedCount}/{totalCards}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStudyNow();
        }}
        className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group/btn"
      >
        <Sparkles size={16} className="group-hover/btn:scale-110 transition-transform" />
        Study Now
      </button>
    </div>
  );
};

export default FlashcardSetCard;
