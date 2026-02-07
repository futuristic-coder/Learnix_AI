import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return "N/A";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
   
  const handleNavigate = () => {
      navigate(`/documents/${document._id}`);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 p-6 cursor-pointer"
    >
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 dark:from-indigo-900/30 dark:to-violet-900/30 blur-2xl group-hover:scale-150 transition-transform duration-500" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 group-hover:from-indigo-200 group-hover:to-indigo-300 dark:group-hover:from-indigo-900/60 dark:group-hover:to-indigo-800/60 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0">
              <FileText className="h-7 w-7 text-indigo-700 dark:text-indigo-300" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                {document.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                {moment(document.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl hover:bg-red-100/80 dark:hover:bg-red-950/40 transition-colors flex-shrink-0"
          >
            <Trash2 className="h-5 w-5 text-red-600/70 dark:text-red-400/70 hover:text-red-700 dark:hover:text-red-300 transition-colors" strokeWidth={2} />
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 dark:to-transparent" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs md:text-sm">
          {document.fileSize !== undefined && (
            <div className="rounded-lg bg-slate-100/70 dark:bg-slate-700/50 p-2.5 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-xs">Size</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">{formatFileSize(document.fileSize)}</p>
            </div>
          )}
          {document.flashcardCount !== undefined && (
            <div className="rounded-lg bg-violet-100/70 dark:bg-violet-900/30 p-2.5 text-center">
              <p className="text-violet-700 dark:text-violet-400 text-xs font-medium">Flashcards</p>
              <p className="font-bold text-violet-900 dark:text-violet-200 mt-1">{document.flashcardCount}</p>
            </div>
          )}
          {document.quizCount !== undefined && (
            <div className="rounded-lg bg-emerald-100/70 dark:bg-emerald-900/30 p-2.5 text-center">
              <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium">Quizzes</p>
              <p className="font-bold text-emerald-900 dark:text-emerald-200 mt-1">{document.quizCount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
