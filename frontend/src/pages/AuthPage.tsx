import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as loginService, register as registerService } from '../services/auth.service';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, User } from 'lucide-react';

const AuthPage = ({ initialMode = 'login' }: { initialMode?: 'login' | 'register' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialMode === 'register' || location.pathname === '/register') {
      setIsLogin(false);
    }
  }, [initialMode, location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await loginService(email, password);
        login(data.access_token, data.user);
      } else {
        const data = await registerService(name, email, password);
        login(data.access_token, data.user);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-teal-50 to-navy-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyOSwgODQsIDEwOSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

      {/* Back Button */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft size={18} />
          Back to Home
        </Button>
      </Link>

      <div className="flex items-center justify-center min-h-screen p-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-2">
              <img src="/icon.png" alt="AskAround Icon" className="h-14 w-14 object-contain" />
              <h1 className="text-4xl font-bold text-black-900">AskAround</h1>
            </div>
            <p className="text-black-600">Your local Q&A community</p>
          </motion.div>

          <Card className="backdrop-blur-sm bg-white/95 border-grey-300">
            <CardHeader className="text-center space-y-4">
              {/* Toggle Buttons */}
              <div className="flex bg-grey-200 p-1.5 rounded-xl shadow-inner">
                <button
                  type="button"
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-navy-700 to-teal-600 text-white shadow-md' 
                      : 'text-black-600 hover:text-black-900'
                  }`}
                  onClick={() => toggleMode(true)}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-navy-700 to-teal-600 text-white shadow-md' 
                      : 'text-black-600 hover:text-black-900'
                  }`}
                  onClick={() => toggleMode(false)}
                >
                  Sign Up
                </button>
              </div>

              <CardDescription className="text-black-600 text-base">
                {isLogin ? 'Welcome back! Please login to continue.' : 'Create an account to start exploring.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-black-700 flex items-center gap-2">
                      <User size={16} />
                      Full Name
                    </label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      autoComplete="name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black-700 flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black-700 flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    isLogin ? 'Login to Account' : 'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
