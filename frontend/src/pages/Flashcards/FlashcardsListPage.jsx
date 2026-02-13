import React,{useState,useEffect} from 'react';
import { Plus, Sparkles, BookOpen } from 'lucide-react';
import flashcardService from "../../services/flashcardService";
import documentService from "../../services/documentService";
import aiService from "../../services/aiService";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";


const FlashcardsListPage = () => {
  const [flashcardSets,setFlashcardSets]=useState([]);
  const [documents,setDocuments]=useState([]);
  const [loading,setLoading]=useState(true);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const [selectedDocId,setSelectedDocId]=useState('');
  const [generating,setGenerating]=useState(false);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const flashcardResponse= await flashcardService.getAllFlashcardSets();
        const documentResponse= await documentService.getDocuments();
        
        console.log("fetchFlashcardSet___",flashcardResponse.data);
        
        setFlashcardSets(flashcardResponse.data);
        setDocuments(documentResponse || []);
      }catch(error){
        toast.error("Failed to fetch data");
        console.error(error)
      }finally{
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  const handleGenerateFlashcards = async () => {
    if (!selectedDocId) {
      toast.error("Please select a document");
      return;
    }
    
    setGenerating(true);
    try {
      await aiService.generateFlashcards(selectedDocId);
      toast.success("Flashcards generated successfully!");
      setIsModalOpen(false);
      setSelectedDocId('');
      // Refetch flashcard sets
      const response = await flashcardService.getAllFlashcardSets();
      setFlashcardSets(response.data);
    } catch (error) {
      toast.error(error.message || "Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const renderContent=()=>{
    if(loading){
      return <Spinner/>;
    }

    if(flashcardSets.length===0){
      return( <EmptyState 
      title="No Flashcard Sets Found"
      description="You haven't created any flashcard sets yet.. Go create one!"/>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcardSets.map((set)=>(
        <FlashcardSetCard key={set.id} flashcardSet={set}/>
      ))}
    </div>
  )
}

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-white via-slate-50 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950/30 p-4 sm:p-8 shadow-sm">
        {/* Animated Backgrounds */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-200/30 dark:bg-violet-900/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-800/40 shadow-lg">
              <Sparkles className="h-10 w-10 text-violet-700 dark:text-violet-300" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Flashcard Sets
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
                AI-powered flashcards to accelerate your learning
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur">
                  <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">{flashcardSets.length} Sets</span>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
            <Plus size={16} />
            <span className="hidden sm:inline">Generate Flashcards</span>
            <span className="sm:hidden">Generate</span>
          </Button>
        </div>
      </div>
      
      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocId('');
        }}
        title="Generate Flashcards"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200 dark:border-violet-800/30">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">AI-Powered Generation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Select a document and our AI will automatically create flashcards from its content.</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400"
            >
              <option value="">-- Choose a document --</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDocId('');
              }}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateFlashcards} 
              disabled={generating || !selectedDocId}
            >
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FlashcardsListPage
