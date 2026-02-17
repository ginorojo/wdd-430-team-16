"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useActionState } from "react";
import { registerUser, loginGoogle } from "@/features/auth/actions"; // Imported loginGoogle action
import { motion } from "framer-motion";
import { User, Store, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * SignupForm Component
 * 
 * A robust, high-premium registration form that serves as the entry point for the "Artisanal Refuge" platform.
 * 
 * Key Capabilities:
 * - Credentials Auth: Native registration using Email/Password with client-side strength hooks.
 * - Social Auth: Google OAuth integration via Server Actions.
 * - Profile Activation: Role selection ('Customer' or 'Artisan') is captured during registration
 *   to bypass the post-login onboarding flow for credential-based users.
 * 
 * Interaction Design:
 * Uses Framer Motion for micro-interactions (magnetic role toggle, validation fades) to maintain
 * the premium brand experience.
 */
export default function SignupForm() {
  /** @state role - Determines the user type ('USER' = Customer, 'SELLER' = Artisan) */
  const [role, setRole] = useState<"USER" | "SELLER">("USER");

  /** @state password - Local state for real-time strength validation */
  const [password, setPassword] = useState("");

  /** @state state - Form state from the 'registerUser' Server Action */
  const [state, dispatch] = useActionState(registerUser, undefined);

  /** @ref formRef - Used to programmatically reset the form upon success */
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Effect: Reset the form state when registration is successful.
   */
  useEffect(() => {
    if (state?.success) {
      setPassword("");
      formRef.current?.reset();
    }
  }, [state]);

  /**
   * useMemo: Computes password strength based on length and character variety.
   * Returns a score from 0 (empty) to 4 (very secure).
   */
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  /** Metadata for the strength indicator UI */
  const strengthMeta = [
    { label: "Very Weak", color: "bg-red-400" },
    { label: "Weak", color: "bg-orange-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Strong", color: "bg-green-500" },
  ];

  const isPasswordSecure = passwordStrength >= 3;
  const errors = state?.error as any;

  return (
    <div className="max-w-md w-full mx-auto p-10 bg-[#FEFAE0] rounded-[2.5rem] shadow-2xl border border-[#DDA15E]/20 animate-in fade-in zoom-in duration-500">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-[#283618] mb-2 tracking-tight">
          Join the Refuge
        </h2>
        <p className="text-[#606C38] text-sm font-medium">
          Start your journey with us today
        </p>
      </div>

      <form ref={formRef} action={dispatch} className="space-y-6">
        {/* Success Feedback - Rendered when user is successfully registered */}
        {state?.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 border border-green-100 text-green-800 rounded-2xl flex items-start gap-3 shadow-sm"
          >
            <CheckCircle2 className="shrink-0 mt-0.5 text-green-600" size={18} />
            <div>
              <p className="text-xs font-bold leading-relaxed">
                {state.success}{" "}
                <a href="/login" className="underline hover:text-green-900 transition-colors">
                  Log in now
                </a>
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          {/* USERNAME FIELD */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full px-5 py-3.5 rounded-2xl border border-[#DDA15E]/40 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25] transition-all text-[#283618] placeholder:text-gray-300"
              aria-required="true"
            />
          </div>

          {/* EMAIL FIELD */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@example.com"
              className="w-full px-5 py-3.5 rounded-2xl border border-[#DDA15E]/40 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25] transition-all text-[#283618] placeholder:text-gray-300"
              aria-required="true"
            />
            {errors?.email && (
              <p className="text-red-600 text-[10px] mt-1.5 font-bold italic ml-1">{errors.email[0]}</p>
            )}
          </div>

          {/* PASSWORD FIELD with Strength Indicator */}
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
              Secret Password
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-2xl border border-[#DDA15E]/40 bg-white/50 focus:bg-white outline-none focus:ring-4 focus:ring-[#BC6C25]/10 focus:border-[#BC6C25] transition-all text-[#283618] placeholder:text-gray-300"
              aria-required="true"
            />

            {/* Visual Password Strength Bar */}
            <div className="mt-3 px-1">
              <div className="flex gap-1.5 h-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-500 ${i < passwordStrength
                      ? strengthMeta[passwordStrength - 1].color
                      : "bg-[#E6DAB5]/30"
                      }`}
                  />
                ))}
              </div>
              {password && (
                <div className="flex justify-between items-center mt-2 text-[9px] font-black uppercase tracking-tighter">
                  <p className={isPasswordSecure ? "text-green-600" : "text-[#BC6C25]"}>
                    Strength: {strengthMeta[passwordStrength - 1]?.label}
                  </p>
                  {!isPasswordSecure && (
                    <span className="text-[#BC6C25]/60 flex items-center gap-1 leading-none">
                      <ShieldAlert size={10} /> Needs more focus
                    </span>
                  )}
                </div>
              )}
            </div>
            {errors?.password && (
              <p className="text-red-600 text-[10px] mt-1.5 font-bold italic ml-1">{errors.password[0]}</p>
            )}
          </div>
        </div>

        {/* ROLE TOGGLE - Accessible custom radio implementation */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black uppercase tracking-widest text-[#BC6C25] mb-1.5 ml-1">
            Select Your Role
          </label>
          <div className="relative flex p-1.5 bg-[#E6DAB5]/40 rounded-2xl border border-[#EADDCA]/20">
            <motion.div
              className="absolute top-1.5 bottom-1.5 left-1.5 rounded-xl bg-white shadow-md border border-[#EADDCA]/10"
              animate={{
                x: role === "USER" ? "0%" : "100%",
                width: "calc(50% - 6px)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
            <button
              type="button"
              onClick={() => setRole("USER")}
              aria-pressed={role === "USER"}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${role === "USER" ? "text-[#283618]" : "text-[#606C38]/60 hover:text-[#283618]"}`}
            >
              <User size={14} /> Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("SELLER")}
              aria-pressed={role === "SELLER"}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${role === "SELLER" ? "text-[#283618]" : "text-[#606C38]/60 hover:text-[#283618]"}`}
            >
              <Store size={14} /> Artisan
            </button>
            <input type="hidden" name="role" value={role} />
          </div>
        </div>

        <button
          type="submit"
          disabled={!isPasswordSecure}
          className="group w-full py-4 px-6 bg-[#BC6C25] hover:bg-[#8D5F42] text-white font-black rounded-2xl shadow-xl shadow-[#BC6C25]/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <span>{isPasswordSecure ? "Join the Refuge" : "Secure Your Account"}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* ERROR FEEDBACK */}
        {errors?.root && (
          <p className="p-4 bg-red-50 text-red-700 rounded-2xl text-[10px] text-center font-black uppercase tracking-wider border border-red-100 flex items-center justify-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
            {errors.root}
          </p>
        )}
      </form>

      {/* SOCIAL DIVIDER */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DDA15E]/20"></div>
        </div>
        <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]">
          <span className="px-4 bg-[#FEFAE0] text-[#BC6C25]/50">Or register with</span>
        </div>
      </div>

      {/* GOOGLE ACTION BUTTON */}
      <form action={loginGoogle}>
        <button
          type="submit"
          className="w-full py-4 px-6 bg-white border border-[#DDA15E]/30 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/80 text-[#283618] font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98] group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="tracking-tight">Connect with Google</span>
        </button>
      </form>

      {/* FOOTER NAVIGATION */}
      <p className="mt-10 text-center text-xs text-[#606C38] font-medium">
        Already part of the family?{" "}
        <a href="/login" className="text-[#BC6C25] font-black hover:text-[#8D5F42] transition-colors inline-flex items-center gap-0.5 group">
          Sign in here
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </p>
    </div>
  );
}
