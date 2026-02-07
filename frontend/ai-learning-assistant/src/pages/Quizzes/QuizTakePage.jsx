import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";


const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error("Failed to load quiz.");
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try{
      const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
  const question = quiz.questions.find(q => q._id === questionId);
  const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
  const optionIndex = selectedAnswers[questionId];
  const selectedAnswer = question.options[optionIndex];
  return { questionIndex, selectedAnswer };
});

await quizService.submitQuiz(quizId, formattedAnswers);
toast.success("Quiz submitted successfully!");
navigate(`/quizzes/${quizId}/results`);
} catch (error) {
  toast.error(error.message || "Failed to submit quiz.");
} finally {
  setSubmitting(false);
}
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }
  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <p className="text-slate-700 text-lg">Quiz not found or has no questions.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title={quiz.title || "Take Quiz"} subtitle="Answer all questions to complete the quiz" />

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-slate-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {answeredCount} of {quiz.questions.length} answered
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-600 to-violet-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg" />
            <span className="text-lg font-semibold text-slate-900">Question {currentQuestionIndex + 1}</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-relaxed">{currentQuestion.question}</h3>
          <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            return (
              <label
                key={index}
                className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? "bg-indigo-50 border-indigo-500 shadow-md" 
                    : "bg-white border-slate-300 hover:border-indigo-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="sr-only"
                />
                <div
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected 
                      ? "border-indigo-500 bg-indigo-500" 
                      : "border-slate-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
                <span
                  className={`flex-1 text-base ${
                    isSelected 
                      ? "text-indigo-900 font-semibold" 
                      : "text-slate-700"
                  }`}
                >
                  {option}
                </span>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={answeredCount !== quiz.questions.length || submitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
      {/* Question Navigation */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Question Navigation</h4>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
          {quiz.questions.map((_, index) => {
            const isAnsweredQuestion = selectedAnswers.hasOwnProperty(quiz.questions[index]._id);
            const isCurrent = index === currentQuestionIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                disabled={submitting}
                className={`w-12 h-12 rounded-lg font-semibold transition-all duration-200 ${
                  isCurrent 
                    ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg scale-110" 
                    : isAnsweredQuestion 
                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" 
                    : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="flex gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-600 to-violet-600" />
            <span className="text-slate-600">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-indigo-100" />
            <span className="text-slate-600">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-200" />
            <span className="text-slate-600">Not Answered</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default QuizTakePage;
