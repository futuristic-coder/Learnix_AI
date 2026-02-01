import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const data = await progressService.getProgress();
        console.log("Dashboard Data:", data);

        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to load dashboard data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgressData();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-blue-600" strokeWidth={2} />
          </div>
          <p className="text-xl font-semibold text-slate-800">
            No progress data available yet
          </p>
          <p className="mt-2 text-slate-600">
            Start learning to see your progress here!
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-600 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-indigo-600 to-violet-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-violet-600 to-purple-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
    },
  ];
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Track your learning progress and activity here.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-3">{stat.label}</p>
                  <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                >
                  <stat.icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
          </div>
          
          {dashboardData.recentActivity &&
          (dashboardData.recentActivity.documents.length > 0 ||
            dashboardData.recentActivity.quizzes.length > 0) ? (
            <div className="space-y-3">
              {[
                ...(dashboardData.recentActivity.documents || []).map(
                  (doc) => ({
                    id: doc._id,
                    description: doc.title,
                    timestamp: doc.lastAccessed,
                    link: `/documents/${doc._id}`,
                    type: "Document",
                  }),
                ),
                ...(dashboardData.recentActivity.quizzes || []).map(
                  (quiz) => ({
                    id: quiz._id,
                    description: quiz.title,
                    timestamp: quiz.lastAttemted,
                    link: `/quizzes/${quiz._id}`,
                    type: "Quiz",
                  }),
                ),
              ]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 5)
                .map((activity, index) => (
                  <div 
                    key={activity.id || index} 
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${activity.type === "Document" ? "bg-blue-50" : "bg-violet-50"}`}>
                        {activity.type === "Document" ? (
                          <FileText className="h-5 w-5 text-blue-600" strokeWidth={2} />
                        ) : (
                          <BrainCircuit className="h-5 w-5 text-violet-600" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {activity.type === "Document" ? "Accessed Document" : "Attempted Quiz"}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    {activity.link && (
                      <a 
                        href={activity.link} 
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-4">
                <Clock className="h-8 w-8 text-slate-400" strokeWidth={2} />
              </div>
              <p className="text-lg font-medium text-slate-700">No recent activity available.</p>
              <p className="text-sm text-slate-500 mt-2">Start learning to see your progress here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
