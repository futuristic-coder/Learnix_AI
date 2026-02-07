import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <p className="text-slate-700 text-lg">Quiz results not found.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Link 
          to={`/documents/${quiz.documentId?._id || quiz.documentId}`} 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Document
        </Link>

        <PageHeader
          title={`${quiz.title || 'Quiz'} Results`}
          subtitle={`Review your performance on ${totalQuestions} questions`}
        />

        {/* Score Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium uppercase tracking-wide mb-2">Your Score</p>
                <div className={`inline-block bg-gradient-to-r ${getScoreColor(score)} text-white font-bold text-4xl py-3 px-6 rounded-xl shadow-lg`}>
                  {score}%
                </div>
                <p className="text-lg font-semibold text-slate-700 mt-3">{getScoreMessage(score)}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 mx-auto mb-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{totalQuestions}</p>
                <p className="text-sm text-slate-600">Total</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-600">{correctAnswers}</p>
                <p className="text-sm text-slate-600">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mx-auto mb-2">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <p className="text-2xl font-bold text-rose-600">{incorrectAnswers}</p>
                <p className="text-sm text-slate-600">Incorrect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Detailed Results
          </h2>
          {detailedResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
                result.isCorrect ? 'border-green-500' : 'border-red-500'
              }`}
            >
                <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    result.isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Question {index + 1}
                      </h3>
                      {result.isCorrect ? (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">
                          ✗ Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed">
                      {result.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Summary for Wrong Answers */}
              {!result.isCorrect && (
                <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Your Answer:</p>
                        <p className="text-base text-red-700 font-medium">{result.selectedAnswer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Correct Answer:</p>
                        <p className="text-base text-green-700 font-medium">{result.correctAnswer}</p>
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
                          ? 'bg-green-50 border-green-500 shadow-sm'
                          : isSelectedAnswer
                          ? 'bg-red-50 border-red-500'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCorrectAnswer
                            ? 'bg-green-600 text-white shadow-md'
                            : isSelectedAnswer
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIndex)}
                        </div>
                        <span className={`flex-1 text-base ${
                          isCorrectAnswer 
                            ? 'font-semibold text-green-900' 
                            : isSelectedAnswer 
                            ? 'font-medium text-red-900' 
                            : 'text-slate-700'
                        }`}>
                          {option}
                        </span>
                        {isCorrectAnswer && (
                          <span className="text-green-600 text-sm font-bold flex items-center gap-1.5 bg-green-100 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                            Correct Answer
                          </span>
                        )}
                        {isSelectedAnswer && !isCorrectAnswer && (
                          <span className="text-red-600 text-sm font-semibold flex items-center gap-1">
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
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-sm font-semibold text-indigo-900 mb-1">Explanation:</p>
                  <p className="text-sm text-indigo-800 leading-relaxed">{result.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link to={`/documents/${quiz.document._id}`}>
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
