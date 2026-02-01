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
      className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition">
            <FileText className="h-6 w-6 text-blue-600" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
              {document.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              Uploaded {moment(document.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 rounded-xl hover:bg-red-50 transition"
        >
          <Trash2 className="h-5 w-5 text-red-600" strokeWidth={2} />
        </button>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="font-medium">
          {document.fileSize !== undefined && (
            <span>{formatFileSize(document.fileSize)}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {document.flashcardCount !== undefined && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" strokeWidth={2} />
              <span>{document.flashcardCount} Flashcards</span>
            </div>
          )}
          {document.quizCount !== undefined && (
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" strokeWidth={2} />
              <span>{document.quizCount} Quizzes</span>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default DocumentCard;
