import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFavoriteQuestions, type Question, unlikeQuestion } from '../services/questions.service';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, MessageCircle, Heart, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getFavoriteQuestions();
                setFavorites(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await unlikeQuestion(id);
            setFavorites(favorites.filter(q => q._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-grey-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b-2 border-grey-300 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                            <ArrowLeft className="text-black-700" size={20} />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-red-500 to-pink-500 p-2 rounded-xl">
                                <Heart className="text-white" size={20} />
                            </div>
                            <h1 className="font-bold text-black-900 text-xl">My Favorites</h1>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-navy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-black-600 font-medium">Loading your favorites...</p>
                        </div>
                    </div>
                ) : favorites.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="bg-gradient-to-br from-red-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={48} className="text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-black-900 mb-3">No favorites yet</h3>
                        <p className="text-black-600 mb-8 max-w-md mx-auto">
                            Start exploring questions on the map and save the ones you find interesting!
                        </p>
                        <Button onClick={() => navigate('/')} size="lg" className="gap-2">
                            <MapPin size={20} />
                            Explore Questions
                        </Button>
                    </motion.div>
                ) : (
                    <div>
                        <div className="mb-6">
                            <p className="text-black-600">
                                You have <span className="font-bold text-navy-700">{favorites.length}</span> saved {favorites.length === 1 ? 'question' : 'questions'}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <AnimatePresence mode="popLayout">
                                {favorites.map((question, index) => (
                                    <motion.div
                                        key={question._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative"
                                    >
                                        <Link to={`/question/${question._id}`}>
                                            <div className="bg-white rounded-2xl shadow-lg border-2 border-grey-300 overflow-hidden hover:shadow-2xl hover:border-navy-700 transition-all duration-300 hover:-translate-y-1">
                                                {/* Color stripe */}
                                                <div className="h-2 bg-gradient-to-r from-navy-700 to-teal-600"></div>
                                                
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-bold text-black-900 text-lg line-clamp-2 flex-1 pr-2 leading-tight group-hover:text-navy-700 transition-colors">
                                                            {question.title}
                                                        </h3>
                                                    </div>
                                                    
                                                    <p className="text-black-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                        {question.content}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3 text-xs text-black-500">
                                                            <div className="flex items-center gap-1">
                                                                <MessageCircle size={14} className="text-teal-600" />
                                                                <span className="font-medium">{question.answers ? question.answers.length : 0}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Heart size={14} className="text-red-500" />
                                                                <span className="font-medium">{question.likeCount}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-black-400">
                                                            <Calendar size={12} />
                                                            {new Date(question.createdAt).toLocaleDateString('en-US', { 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Remove button */}
                                        <button
                                            onClick={(e) => handleRemove(e, question._id)}
                                            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                            title="Remove from favorites"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default FavoritesPage;
