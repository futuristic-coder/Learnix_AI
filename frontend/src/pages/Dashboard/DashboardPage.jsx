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
        const errorMessage = error.message || "Failed to load dashboard data. Please try again later.";
        toast.error(errorMessage);
        console.error("Dashboard Error:", error);
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 mx-auto mb-6">
            <TrendingUp className="h-10 w-10 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          </div>
          <p className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            No progress data available yet
          </p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
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
      gradient: "from-indigo-600 to-violet-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-violet-600 to-purple-600",
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-purple-600 to-fuchsia-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
  ];

  const activityItems = [
    ...(dashboardData.recentActivity?.documents || []).map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed || doc.updatedAt || doc.createdAt,
      link: `/documents/${doc._id}`,
      type: "Document",
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.completedAt || quiz.updatedAt || quiz.createdAt,
      link: `/quizzes/${quiz._id}/results`,
      type: "Quiz",
    })),
  ];

  const sortedActivities = [...activityItems].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const recentActivities = sortedActivities.slice(0, 5);
  const latestActivity = sortedActivities[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyCount = activityItems.filter(
    (activity) => new Date(activity.timestamp) >= weekAgo
  ).length;
  
  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Animated background blobs */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20 animate-pulse" />
      <div className="absolute top-64 -left-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20 animate-pulse" style={{animationDelay: '2s'}} />

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 backdrop-blur p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 blur-3xl dark:from-indigo-600/20 dark:to-violet-600/20" />
          <div className="relative space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 px-4 py-2 border border-indigo-200/50 dark:border-indigo-800/50 mb-4">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></div>
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">DASHBOARD</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                  Welcome to your learning hub
                </h1>
                <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                  Track your progress, access your study materials, and continue where you left off.
                </p>

                {/* Stat Chips */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="group relative rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-violet-100/0 group-hover:from-indigo-50/50 group-hover:to-violet-100/50 dark:group-hover:from-indigo-900/20 dark:group-hover:to-violet-900/20 transition-all duration-300" />
                      <div className="relative">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 mb-3`}>
                          <stat.icon className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Highlighted Cards */}
              <div className="space-y-4">
                {/* Next Up Card */}
                <div className="relative overflow-hidden rounded-2xl border border-indigo-200/70 dark:border-indigo-800/70 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.15em] text-white/70 font-semibold">Next focus</p>
                    {latestActivity ? (
                      <>
                        <p className="mt-3 text-lg font-semibold line-clamp-2">
                          {latestActivity.type === "Document" ? "📄" : "📝"} {latestActivity.description}
                        </p>
                        {latestActivity.link && (
                          <a
                            href={latestActivity.link}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition-all duration-300"
                          >
                            Continue →
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="mt-3 text-lg font-semibold">Get started</p>
                        <p className="text-xs text-white/70 mt-2">Upload a new document to begin</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Weekly Card */}
                <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 dark:border-emerald-800/70 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-200/20 blur-2xl dark:bg-emerald-900/20" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300 font-semibold">This week</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-900 dark:text-emerald-100">{weeklyCount}</p>
                        <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">
                          {weeklyCount === 0 ? "No activity yet" : `activity${weeklyCount !== 1 ? "ies" : ""}`}
                        </p>
                      </div>
                      <div className="text-5xl opacity-20">🔥</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
              <Clock className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your latest interactions</p>
            </div>
          </div>

          {recentActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-gradient-to-r from-white/70 to-slate-50/50 dark:from-slate-800/70 dark:to-slate-900/50 p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 dark:from-indigo-900/30 dark:to-violet-900/30 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${activity.type === "Document" ? "from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50" : "from-violet-100 to-violet-200 dark:from-violet-900/50 dark:to-violet-800/50"} shadow-md`}>
                        {activity.type === "Document" ? (
                          <FileText className="h-5 w-5 text-indigo-700 dark:text-indigo-300" strokeWidth={2} />
                        ) : (
                          <BrainCircuit className="h-5 w-5 text-violet-700 dark:text-violet-300" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {activity.type === "Document" ? "Document" : "Quiz"}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${activity.type === "Document" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"}`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 truncate font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    {activity.link && (
                      <a
                        href={activity.link}
                        className="ml-4 flex-shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-violet-600"
                      >
                        →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mx-auto mb-4 shadow-md">
                <Clock className="h-10 w-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No activity yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Start by uploading a document or taking a quiz</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
