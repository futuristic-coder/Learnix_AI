import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-lg w-full text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 mx-auto mb-6">
          <Compass className="h-8 w-8 text-indigo-600" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage
