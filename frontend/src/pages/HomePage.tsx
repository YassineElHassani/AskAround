import { useEffect, useState, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import MapComponent from '../components/Map';
import { getNearbyQuestions, type Question } from '../services/questions.service';
import CreateQuestionModal from '../components/CreateQuestionModal';
import { Button } from '../components/ui/Button';
import { Plus, LogOut, MapPin, MessageSquare, Users, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomePage = () => {
  const { position, loading: locationLoading, error: locationError } = useGeolocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  
  const fetchQuestions = async () => {
    if (position) {
      try {
        const data = await getNearbyQuestions(position.latitude, position.longitude);
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      }
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [position]);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAddQuestion = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="AskAround Logo" className="h-10 w-10 object-contain" />
              <span className="font-bold text-xl text-black-900">AskAround</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={scrollToMap} className="text-black-700 hover:text-navy-700 font-medium transition-colors">
                Explore
              </button>
              <button onClick={scrollToAddQuestion} className="text-black-700 hover:text-navy-700 font-medium transition-colors">
                Ask Question
              </button>
              {user && (
                <Link to="/favorites" className="text-black-700 hover:text-navy-700 font-medium transition-colors">
                  Favorites
                </Link>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={logout}
                    className="hover:bg-red-50 text-red-500"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-navy-700 to-teal-600 hover:from-navy-800 hover:to-teal-700 text-white shadow-lg">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black-100 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-border"
            >
              <div className="px-4 py-4 space-y-3">
                <button onClick={() => { scrollToMap(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black-700 hover:bg-navy-50 rounded-lg">
                  Explore
                </button>
                <button onClick={() => { scrollToAddQuestion(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-black-700 hover:bg-navy-50 rounded-lg">
                  Ask Question
                </button>
                {user ? (
                  <>
                    <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-black-700 hover:bg-navy-50 rounded-lg">
                      Favorites
                    </Link>
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block">
                    <Button className="w-full bg-gradient-to-r from-navy-700 to-teal-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-50 via-teal-50 to-grey-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNTUsIDIwMCwgMTIwLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-navy-200 mb-6"
              >
                <span className="w-2 h-2 bg-navy-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-navy-800">Location-Based Q&A Platform</span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-black-900 mb-6 leading-tight">
                Ask Questions.
                <br />
                <span className="bg-gradient-to-r from-navy-700 to-teal-600 bg-clip-text text-transparent">
                  Get Local Answers.
                </span>
              </h1>
              
              <p className="text-lg text-black-700 mb-8 leading-relaxed">
                Connect with your community and discover insights about your surroundings. 
                Ask questions, share knowledge, and explore what's happening nearby.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={scrollToMap}
                  size="lg"
                  className="bg-gradient-to-r from-navy-700 to-teal-600 hover:from-navy-800 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all"
                >
                  Explore Questions
                  <ArrowRight size={20} className="ml-2" />
                </Button>
                <Button 
                  onClick={scrollToAddQuestion}
                  variant="outline"
                  size="lg"
                  className="border-2 border-navy-700 text-navy-700 hover:bg-navy-50"
                >
                  <Plus size={20} className="mr-2" />
                  Ask a Question
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-black-200">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <div className="text-3xl font-bold text-navy-700">{questions.length}+</div>
                  <div className="text-sm text-black-700">Questions Nearby</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="text-3xl font-bold text-teal-600">3km</div>
                  <div className="text-sm text-black-700">Search Radius</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className="text-3xl font-bold text-grey-600">Live</div>
                  <div className="text-sm text-black-700">Real-time Updates</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="relative hidden lg:block"
            >
              
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-navy-500 to-teal-500 rounded-3xl opacity-20 blur-3xl"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 space-y-6">

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = (e.clientX - rect.left - rect.width / 2) / 20;
                      const y = (e.clientY - rect.top - rect.height / 2) / 20;
                      const moveX = (e.clientX - rect.left - rect.width / 2) / 15;
                      const moveY = (e.clientY - rect.top - rect.height / 2) / 15;
                      e.currentTarget.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateX(${moveX}px) translateY(${moveY}px) scale(1.05)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateX(0px) translateY(0px) scale(1)';
                    }}
                    style={{ transition: 'transform 0.1s ease-out' }}
                    className="cursor-pointer"
                  >
                    <DotLottieReact
                      src="asking_transparent.json"
                      loop
                      autoplay
                    />
                  </motion.div>

                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-navy-50 to-teal-50 rounded-xl border border-navy-200">
                    <div className="bg-navy-700 p-3 rounded-lg">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-black-900">Geolocation Powered</div>
                      <div className="text-sm text-black-700">Find questions near you</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-grey-50 rounded-xl border border-teal-200">
                    <div className="bg-teal-600 p-3 rounded-lg">
                      <MessageSquare className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-black-900">Real Conversations</div>
                      <div className="text-sm text-black-700">Get answers from locals</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-grey-50 to-navy-50 rounded-xl border border-grey-200">
                    <div className="bg-grey-400 p-3 rounded-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-black-900">Community Driven</div>
                      <div className="text-sm text-black-700">Built by and for the community</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section ref={mapRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-black-900 mb-4">
              Explore Nearby <span className="bg-gradient-to-r from-navy-700 to-teal-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg text-black-700 max-w-2xl mx-auto">
              Discover what people are asking around you. Click on any marker to view details and join the conversation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-black-200"
            style={{ height: '600px' }}
          >
            {locationLoading ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-navy-50 to-teal-50">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-navy-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-black-700 font-medium">Getting your location...</p>
                </div>
              </div>
            ) : locationError ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50">
                <div className="text-center">
                  <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
                    <MapPin className="text-red-600" size={32} />
                  </div>
                  <p className="text-red-600 font-medium">{locationError}</p>
                </div>
              </div>
            ) : (
              <MapComponent 
                userLocation={position} 
                questions={questions}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black-900 via-navy-900 to-black-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Connect with Your Community?
            </h2>
            <p className="text-xl text-black-100 mb-10">
              Join thousands of users asking questions and sharing local knowledge.
            </p>
            <Button 
              onClick={scrollToAddQuestion}
              size="lg"
              className="bg-gradient-to-r from-grey-300 to-grey-400 hover:from-grey-400 hover:to-grey-500 text-black-900 shadow-2xl text-lg px-8 py-6 h-auto font-bold"
            >
              <Plus size={24} className="mr-2" />
              Ask Your First Question
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button 
          onClick={() => {
            if (user) setIsModalOpen(true);
            else navigate('/auth');
          }}
          className="rounded-full h-16 w-16 p-0 shadow-2xl bg-gradient-to-br from-navy-700 to-teal-600 hover:from-navy-800 hover:to-teal-700 text-white transition-all hover:scale-110 flex items-center justify-center"
        >
          <Plus size={28} strokeWidth={2.5} />
        </Button>
      </motion.div>

      <CreateQuestionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        location={position}
        onQuestionCreated={fetchQuestions}
      />
    </div>
  );
};

export default HomePage;
