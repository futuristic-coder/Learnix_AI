import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
  BookOpen,
} from "lucide-react";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const documentIdFromState = location.state?.documentId;

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error("Failed to fetch quiz results.");
        console.error("Error fetching quiz results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId]);

  if (loading) {
    return( <div> <Spinner /> </div>);
  }

  if (!results || !results.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center max-w-md">
          <p className="text-slate-700 dark:text-slate-300 text-lg">Quiz results not found.</p>
        </div>
      </div>
    );
  }

const { data: { quiz, results: detailedResults } } = results;
const score = quiz.score;
const totalQuestions = detailedResults.length;
const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
const incorrectAnswers = totalQuestions - correctAnswers;

const getScoreColor = (score) => {
  if (score >= 80) return "from-emerald-500 to-teal-500";
  if (score >= 60) return "from-amber-500 to-orange-500";
  return "from-red-500 to-rose-500";
};

const getScoreMessage = (score) => {
  if (score >= 90) return "Excellent work!";
  if (score >= 80) return "Great job!";
  if (score >= 70) return "Good effort!";
  if (score >= 60) return "You passed!";
  return "Better luck next time! keep practicing.";
};

  const getDocumentLink = () => {
    // Priority: use state > quiz.document._id > quiz.documentId (object) > quiz.documentId (string)
    if (documentIdFromState) return `/documents/${documentIdFromState}`;
    if (quiz.document?._id) return `/documents/${quiz.document._id}`;
    if (quiz.documentId?._id) return `/documents/${quiz.documentId._id}`;
    if (quiz.documentId && typeof quiz.documentId === 'string') return `/documents/${quiz.documentId}`;
    return '/documents';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        <Link 
          to={getDocumentLink()}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Document
        </Link>

        <PageHeader
          title={`${quiz.title || 'Quiz'} Results`}
          subtitle={`Review your performance on ${totalQuestions} questions`}
        />

        {/* Score Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-slate-200 dark:border-slate-700 backdrop-blur">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wide mb-2">Your Score</p>
                <div className={`inline-block bg-gradient-to-r ${getScoreColor(score)} text-white font-bold text-4xl py-3 px-6 rounded-2xl shadow-lg`}>
                  {score}%
                </div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-3">{getScoreMessage(score)}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 mx-auto mb-3 shadow-lg">
                  <Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{totalQuestions}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 mx-auto mb-3 shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{correctAnswers}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-rose-100 dark:bg-rose-900/40 mx-auto mb-3 shadow-lg">
                  <XCircle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-rose-600 dark:text-rose-400">{incorrectAnswers}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Incorrect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Detailed Results
          </h2>
          {detailedResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
                result.isCorrect ? 'border-green-500 dark:border-green-400' : 'border-red-500 dark:border-red-400'
              }`}
            >
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    result.isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-lg">
                        Question {index + 1}
                      </h3>
                      {result.isCorrect ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                          ✗ Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                      {result.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Summary for Wrong Answers */}
              {!result.isCorrect && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-l-4 border-orange-400 dark:border-orange-500 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Answer:</p>
                        <p className="text-base text-red-700 dark:text-red-400 font-medium">{result.selectedAnswer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Correct Answer:</p>
                        <p className="text-base text-green-700 dark:text-green-400 font-medium">{result.correctAnswer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-4">
                {result.options.map((option, optIndex) => {
                  const isCorrectAnswer = option === result.correctAnswer;
                  const isSelectedAnswer = option === result.selectedAnswer;
                  
                  return (
                    <div
                      key={optIndex}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCorrectAnswer
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-500 shadow-sm'
                          : isSelectedAnswer
                          ? 'bg-red-50 dark:bg-red-950/20 border-red-500 dark:border-red-500'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrectAnswer
                            ? 'bg-green-600 dark:bg-green-600 text-white shadow-md'
                            : isSelectedAnswer
                            ? 'bg-red-600 dark:bg-red-600 text-white'
                            : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span className={`flex-1 text-base ${
                          isCorrectAnswer 
                            ? 'font-semibold text-green-900 dark:text-green-300' 
                            : isSelectedAnswer 
                            ? 'font-medium text-red-900 dark:text-red-300' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {option}
                        </span>
                        {isCorrectAnswer && (
                          <span className="text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                            Correct Answer
                          </span>
                        )}
                        {isSelectedAnswer && !isCorrectAnswer && (
                          <span className="text-red-600 dark:text-red-400 text-sm font-semibold flex items-center gap-1">
                            <XCircle className="w-4 h-4" />
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {result.explanation && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                  <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">Explanation:</p>
                  <p className="text-sm text-indigo-800 dark:text-indigo-400 leading-relaxed">{result.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link to={getDocumentLink()}>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <BookOpen className="w-5 h-5" />
              Back to Document
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
