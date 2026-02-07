import React from "react";
import { Link } from "react-router-dom";
import { Play, BarChart2, Trash2, Award } from "lucide-react";
import moment from "moment";

const QuizCard = ({quiz, onDelete}) => {
  const isCompleted = quiz?.userAnswers?.length > 0;
  
  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col group">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Delete quiz"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <div className="space-y-5 flex-1">
        {isCompleted && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium w-fit border border-amber-200">
            <Award className="w-4 h-4" />
            <span className="font-semibold">Score: {quiz?.score}%</span>
          </div>
        )}

        <div className="pr-8">
          <h3
            title={quiz.title}
            className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2"
          >
            {quiz.title ||
              `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Created {moment(quiz.createdAt).format("MMM D, YYYY")}</span>
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            <span className="font-semibold">
              {quiz.questions.length}{" "}
              {quiz.questions.length === 1 ? "Question" : "Questions"}
            </span>
          </div>
          {!isCompleted && (
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Not started</span>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        {isCompleted ? (
          <Link to={`/quizzes/${quiz._id}/results`} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
              <BarChart2 className="w-5 h-5" />
              View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`} className="block">
            <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
