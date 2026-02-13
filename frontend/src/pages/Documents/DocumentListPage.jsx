import React, { useState, useEffect, use } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data || []);
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch documents.";
      toast.error(errorMessage);
      console.error("Document Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully.");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      const errorMessage = error.message || "Failed to upload document.";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success("Document deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };


  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-10">
          <Spinner />
        </div>
      );
    }
    if (documents.length === 0) {
      return (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur p-12 md:p-16 text-center">
          <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-900/20" />
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 mx-auto mb-6 shadow-lg">
              <FileText className="h-10 w-10 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Start your document library</h3>
            <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Upload your first document to unlock AI-powered learning tools, create flashcards, and take quizzes.
            </p>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteDocument}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Animated background blobs */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20 animate-pulse" />
      <div className="absolute top-40 -left-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/20 animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 backdrop-blur p-4 sm:p-8 md:p-12">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/20 to-violet-400/20 blur-3xl dark:from-indigo-600/20 dark:to-violet-600/20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 px-3 sm:px-4 py-1.5 sm:py-2 border border-indigo-200/50 dark:border-indigo-800/50 mb-3 sm:mb-4">
              <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">DOCUMENTS</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">My Documents</h1>
                <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Upload, organize, and study your learning materials with AI-powered tools.</p>
              </div>
              {documents.length > 0 && (
                <Button onClick={() => setIsUploadModalOpen(true)} className="hidden md:flex shrink-0">
                  <Plus className="h-5 w-5" />
                  Upload Document
                </Button>
              )}
            </div>
            {documents.length > 0 && (
              <div className="md:hidden mt-6">
                <Button onClick={() => setIsUploadModalOpen(true)} className="w-full">
                  <Plus className="h-5 w-5" />
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        </div>

        {renderContent()}

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
            <div className="w-full max-w-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl border border-slate-200/70 dark:border-slate-700/70 p-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/30" />
              <button onClick={() => setIsUploadModalOpen(false)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition relative z-10">
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
              </button>

              <div className="mb-6 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 px-3 py-1.5 border border-indigo-200/50 dark:border-indigo-800/50 mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">UPLOAD</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">Add new document</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Upload PDF documents to create flashcards, quizzes, and chat with AI about them.
                </p>
              </div>
              <form onSubmit={handleUpload} className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">Document Title</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur px-4 py-3 text-sm text-slate-800 dark:text-slate-100 shadow-sm hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 transition"
                    placeholder="e.g. Biology Chapter 1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-slate-100">PDF File</label>
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        {uploadFile ? (
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{uploadFile.name}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ Ready to upload</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">PDF files only, max 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" disabled={uploading} onClick={() => setIsUploadModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl border border-slate-200/70 dark:border-slate-700/70 p-6 relative overflow-hidden">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-200/30 blur-3xl dark:bg-red-900/20" />
              <button onClick={() => setIsDeleteModalOpen(false)} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition relative z-10">
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" strokeWidth={2} />
              </button>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-lg">
                    <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delete Document</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">This cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-700/40 rounded-xl p-3 mt-3">
                  Delete <span className="font-semibold">{selectedDoc?.title}</span>?
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6 relative z-10">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  variant="danger"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentListPage;
