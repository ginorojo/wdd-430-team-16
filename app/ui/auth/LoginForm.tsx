'use client';

import { loginUser, loginGoogle } from '@/features/auth/actions';
import { useActionState } from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginForm() {
  const [state, dispatch] = useActionState(loginUser, undefined);

  return (
    <div className="max-w-md w-full mx-auto p-10 bg-[#FEFAE0] rounded-[2.5rem] shadow-2xl border border-[#DDA15E]/20 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#283618] mb-2">Welcome Back</h2>
        <p className="text-[#606C38] text-sm font-medium">Continue your artisanal journey</p>
      </div>

      {/* Email/Password Form */}
      <form action={dispatch} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <label className="block text-xs font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BC6C25]/50 group-focus-within:text-[#BC6C25] transition-colors" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="artisan@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DDA15E]/40 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25] transition-all text-[#283618] placeholder:text-gray-300"
              />
            </div>
            {state?.error && 'email' in state.error && (
              <p className="text-red-600 text-xs mt-1.5 font-bold ml-1 flex items-center gap-1 italic">
                <span className="w-1 h-1 bg-red-600 rounded-full" /> {state.error.email}
              </p>
            )}
          </div>

          <div className="relative group">
            <label className="block text-xs font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BC6C25]/50 group-focus-within:text-[#BC6C25] transition-colors" size={18} />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DDA15E]/40 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25] transition-all text-[#283618] placeholder:text-gray-300"
              />
            </div>
            {state?.error && 'password' in state.error && (
              <p className="text-red-600 text-xs mt-1.5 font-bold ml-1 flex items-center gap-1 italic">
                <span className="w-1 h-1 bg-red-600 rounded-full" /> {state.error.password}
              </p>
            )}
          </div>
        </div>

        {/* General Error */}
        {state?.error && 'root' in state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-bold flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {state.error.root}
          </motion.div>
        )}

        <button
          type="submit"
          className="group w-full py-4 px-6 bg-[#BC6C25] hover:bg-[#8D5F42] text-white font-black rounded-2xl shadow-[0_10px_20px_-5px_rgba(188,108,37,0.4)] hover:shadow-[0_15px_30px_-10px_rgba(141,95,66,0.5)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <span>Sign In to Refuge</span>
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Premium Divider */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DDA15E]/30"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
          <span className="px-4 bg-[#FEFAE0] text-[#BC6C25]/60">Safe Authentication</span>
        </div>
      </div>

      {/* Google Button */}
      <form action={loginGoogle}>
        <button
          type="submit"
          className="w-full py-4 px-6 bg-white border border-[#DDA15E]/30 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FDFBF7] text-[#283618] font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="tracking-tight">Connect with Google</span>
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#606C38] font-medium">
          New to the refuge?{' '}
          <a href="/signup" className="text-[#BC6C25] font-black hover:text-[#8D5F42] transition-colors inline-flex items-center gap-1 group">
            Create an account
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </p>
      </div>
    </div>
  );
}