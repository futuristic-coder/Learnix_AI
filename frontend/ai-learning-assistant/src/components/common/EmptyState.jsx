import React from "react";
import { FileText, Plus } from "lucide-react";

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-300">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-6 shadow-lg">
        <FileText className="w-10 h-10 text-indigo-600" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 max-w-lg text-lg mb-8 leading-relaxed">{description}</p>
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
