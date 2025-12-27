import React, { useState } from 'react';
import { FolderPlus, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                },
            });
            if (error) throw error;
            alert('Check your email for the confirmation link!');
        }
        // onLogin will be handled by auth state change in App
    } catch (err: any) {
        setError(err.message || 'An error occurred');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-onyx-950 flex flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none opacity-50"></div>

      <div className="w-full max-w-md bg-onyx-900 border border-onyx-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-accent-600 to-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-accent-600/20">
                <FolderPlus size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to OnyxFlow</h1>
            <p className="text-onyx-400 text-sm mt-2 text-center">
                {isLogin ? 'Sign in to access your creative workspace' : 'Create your account and start organizing projects'}
            </p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-onyx-400 ml-1">Full Name</label>
                    <div className="relative group">
                        <User size={16} className="absolute left-3 top-3.5 text-onyx-500 group-focus-within:text-accent-500 transition-colors" />
                        <input 
                            type="text" 
                            required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-onyx-950 border border-onyx-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-onyx-600 focus:outline-none focus:border-accent-500 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-1">
                <label className="text-xs font-medium text-onyx-400 ml-1">Email Address</label>
                <div className="relative group">
                    <Mail size={16} className="absolute left-3 top-3.5 text-onyx-500 group-focus-within:text-accent-500 transition-colors" />
                    <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-onyx-950 border border-onyx-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-onyx-600 focus:outline-none focus:border-accent-500 transition-colors"
                        placeholder="design@studio.com"
                    />
                </div>
            </div>

            <div className="space-y-1">
                 <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-medium text-onyx-400">Password</label>
                    {isLogin && <a href="#" className="text-xs text-accent-500 hover:text-accent-400 transition-colors">Forgot password?</a>}
                 </div>
                <div className="relative group">
                    <Lock size={16} className="absolute left-3 top-3.5 text-onyx-500 group-focus-within:text-accent-500 transition-colors" />
                    <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-onyx-950 border border-onyx-800 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-onyx-600 focus:outline-none focus:border-accent-500 transition-colors"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-accent-600 hover:bg-accent-500 text-white font-semibold py-3 rounded-lg mt-6 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-onyx-800 text-center">
            <p className="text-sm text-onyx-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setName(''); setError(null); }} 
                    className="text-accent-500 hover:text-accent-400 ml-1.5 font-medium transition-colors outline-none"
                >
                    {isLogin ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
      </div>
      
      <div className="mt-8 text-onyx-600 text-xs text-center">
        <p>&copy; 2024 OnyxFlow. Streamlining creative workflows.</p>
      </div>
    </div>
  );
};