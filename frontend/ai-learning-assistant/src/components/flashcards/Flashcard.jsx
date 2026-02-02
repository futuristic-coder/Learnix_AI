import { useState } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative w-full h-80 perspective cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl shadow-xl border-2 border-purple-200 p-8 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold capitalize">
              {flashcard?.difficulty || 'Medium'}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2.5}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl font-semibold text-gray-800 text-center leading-relaxed">{flashcard.question}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-purple-600 mt-4">
            <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-sm font-medium">Click to reveal answer</span>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-xl border-2 border-indigo-200 p-8 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              Answer
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                flashcard.isStarred
                  ? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2.5}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg text-gray-700 text-center leading-relaxed">{flashcard.answer}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-indigo-600 mt-4">
            <RotateCcw className="w-5 h-5" strokeWidth={2.5} />
            <span className="text-sm font-medium">Click to go back</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
