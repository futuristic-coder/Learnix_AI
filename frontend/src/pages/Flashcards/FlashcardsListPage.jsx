import React,{useState,useEffect} from 'react';
import { Plus } from 'lucide-react';
import flashcardService from "../../services/flashcardService";
import documentService from "../../services/documentService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
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
      <PageHeader title="Flashcard Sets" subtitle="Generate and review flashcards across your documents.">
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Generate Flashcards
        </Button>
      </PageHeader>
      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocId('');
        }}
        title="Generate Flashcards"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a document --</option>
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
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
