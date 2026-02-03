import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionById, getAnswers, createAnswer, type Answer } from '../services/answers.service';
import { type Question, likeQuestion, unlikeQuestion, getFavoriteQuestions } from '../services/questions.service';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ArrowLeft, User, Heart, Send, MapPin, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [qData, aData] = await Promise.all([
          getQuestionById(id),
          getAnswers(id)
        ]);
        setQuestion(qData);
        setAnswers(aData);
        
        // Check if question is already in favorites
        if (user) {
          try {
            const favorites = await getFavoriteQuestions();
            const isFavorite = favorites.some(fav => fav._id === id);
            setIsLiked(isFavorite);
          } catch (err) {
            console.error('Failed to check favorites:', err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleCreateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        navigate('/auth');
        return;
    }
    if (!id || !newAnswer.trim()) return;

    setSubmitting(true);
    try {
      const addedAnswer = await createAnswer(id, newAnswer);
      if (addedAnswer && addedAnswer._id) {
        // Populate the author field with current user data
        const enrichedAnswer = {
          ...addedAnswer,
          author: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        };
        setAnswers([enrichedAnswer, ...answers]);
        setNewAnswer('');
        // Update question's answer count
        setQuestion(prev => prev ? { ...prev, answers: [...(prev.answers || []), enrichedAnswer] } : null);
      }
    } catch (err) {
      console.error('Failed to create answer:', err);
      alert('Failed to post answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async () => {
    if (!user) {
        navigate('/auth');
        return;
    }
    if (!id) return;
    
    const previousLiked = isLiked;
    const previousLikeCount = question?.likeCount || 0;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setQuestion(prev => prev ? { 
      ...prev, 
      likeCount: isLiked ? prev.likeCount - 1 : prev.likeCount + 1 
    } : null);
    
    try {
        if (previousLiked) {
            await unlikeQuestion(id);
        } else {
            await likeQuestion(id);
        }
    } catch (err: any) {
        // Revert on error
        setIsLiked(previousLiked);
        setQuestion(prev => prev ? { ...prev, likeCount: previousLikeCount } : null);
        
        if (err.response?.status === 409) {
          // Already liked/unliked - sync state
          setIsLiked(!previousLiked);
        } else {
          console.error('Failed to toggle like:', err);
        }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-navy-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black-600 font-medium">Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <MessageSquare size={64} className="text-red-400 mb-4" />
        <p className="text-black-900 font-bold text-xl mb-2">Question not found</p>
        <Button onClick={() => navigate('/')}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-grey-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b-2 border-black-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
              <ArrowLeft className="text-black-700" size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-navy-700" />
              <h1 className="font-bold text-black-900 text-lg">Question Details</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Question Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-black-200 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-navy-700 to-teal-600 p-6 text-white">
            <div className="flex gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-lg">{question.author?.name || 'Anonymous'}</p>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Calendar size={14} />
                  {new Date(question.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-3xl font-bold text-black-900 mb-4 leading-tight">{question.title}</h2>
            <p className="text-black-700 text-lg leading-relaxed mb-6">{question.content}</p>

            {/* Stats & Actions */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-black-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <MessageSquare size={18} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black-900">{question.answers.length}</p>
                    <p className="text-xs text-black-600">Answers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Heart size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black-900">{question.likeCount}</p>
                    <p className="text-xs text-black-600">Likes</p>
                  </div>
                </div>
              </div>
              <Button 
                variant={isLiked ? "default" : "outline"}
                onClick={toggleLike}
                className={cn(
                  "gap-2 font-bold",
                  isLiked && "bg-gradient-to-r from-red-500 to-pink-500"
                )}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Add Answer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-black-200 p-6"
        >
          <h3 className="font-bold text-xl text-black-900 mb-4 flex items-center gap-2">
            <Send size={20} className="text-navy-700" />
            Share Your Answer
          </h3>
          
          <form onSubmit={handleCreateAnswer} className="space-y-4">
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Share your knowledge or experience..."
              className="w-full rounded-xl border-2 border-black-200 bg-white p-4 shadow-sm focus:border-navy-600 focus:ring-4 focus:ring-navy-100 min-h-[120px] resize-none text-black-900 font-medium placeholder:text-black-400 transition-all"
              required
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={submitting || !newAnswer.trim()}
              className="w-full sm:w-auto gap-2 font-bold"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Post Answer
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Answers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare size={24} className="text-navy-700" />
            <h3 className="font-bold text-2xl text-black-900">
              All Answers {answers.length > 0 && `(${answers.length})`}
            </h3>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {answers.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-black-200"
                >
                  <MessageSquare size={48} className="text-black-300 mx-auto mb-4" />
                  <p className="text-black-600 font-medium text-lg mb-2">No answers yet</p>
                  <p className="text-black-400">Be the first to help answer this question!</p>
                </motion.div>
              ) : (
                answers.map((answer, i) => (
                  answer && answer.author ? (
                    <motion.div 
                      key={answer._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-xl p-6 shadow-md border-2 border-black-200 hover:shadow-xl hover:border-navy-300 transition-all"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-navy-700 flex items-center justify-center text-white font-bold shrink-0">
                          {answer.author?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-black-900">
                              {answer.author?.name || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-black-500">
                              <Calendar size={12} />
                              {new Date(answer.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                          <p className="text-black-700 leading-relaxed">{answer.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default QuestionPage;
