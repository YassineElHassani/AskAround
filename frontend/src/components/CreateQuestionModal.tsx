import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, MessageSquarePlus, AlertCircle, Send } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { createQuestion } from '../services/questions.service';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: { latitude: number; longitude: number } | null;
  onQuestionCreated: () => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ 
  isOpen, 
  onClose, 
  location, 
  onQuestionCreated 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createQuestion({
        title,
        content,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setTitle('');
      setContent('');
      onQuestionCreated();
      onClose();
    } catch (err) {
      setError('Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-md"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto overflow-hidden border-2 border-black-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-navy-600 to-teal-500 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <MessageSquarePlus size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Ask a Question</h2>
                      <p className="text-white/80 text-sm">Share your question with the community</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleClose} 
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-black-900">
                    <MessageSquarePlus size={16} className="text-navy-600" />
                    Question Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Best coffee shop nearby?"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-black-500">{title.length}/100 characters</p>
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-black-900">
                    <Send size={16} className="text-navy-600" />
                    Question Details
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide more context to help others understand your question better..."
                    className="w-full rounded-xl border-2 border-black-200 bg-white p-4 text-black-900 font-medium placeholder:text-black-400 focus:border-navy-500 focus:ring-4 focus:ring-navy-100 min-h-[140px] resize-none transition-all"
                    required
                    maxLength={500}
                  />
                  <p className="text-xs text-black-500">{content.length}/500 characters</p>
                </div>

                {/* Location Info */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${location ? 'bg-navy-50 border-navy-200' : 'bg-orange-50 border-orange-200'}`}>
                  <div className={`p-2 rounded-lg ${location ? 'bg-navy-100' : 'bg-orange-100'}`}>
                    <MapPin size={20} className={location ? 'text-navy-600' : 'text-orange-600'} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm mb-1 ${location ? 'text-navy-900' : 'text-orange-900'}`}>
                      {location ? 'Location Confirmed' : 'Location Required'}
                    </p>
                    <p className={`text-xs ${location ? 'text-navy-700' : 'text-orange-700'}`}>
                      {location 
                        ? `Your question will be visible to users near ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                        : 'Please enable location services to post your question'}
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                    >
                      <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t-2 border-black-100">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 gap-2"
                    disabled={loading || !location}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Post Question
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateQuestionModal;
