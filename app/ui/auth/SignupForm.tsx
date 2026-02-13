"use client";

import { useState, useMemo, useEffect, useRef } from "react"; // Added useEffect & useRef
import { useActionState } from "react";
import { registerUser } from "@/features/auth/actions";
import { motion } from "framer-motion";
import { User, Store, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function SignupForm() {
  const [role, setRole] = useState<"USER" | "SELLER">("USER");
  const [password, setPassword] = useState("");
  const [state, dispatch] = useActionState(registerUser, undefined);
  const formRef = useRef<HTMLFormElement>(null); // Ref to the form element

  // Clear password and form on success
  useEffect(() => {
    if (state?.success) {
      setPassword(""); // Clear the controlled password state
      formRef.current?.reset(); // Clear all other uncontrolled fields (name, email)
    }
  }, [state]);

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthMeta = [
    { label: "Muy débil", color: "bg-red-400" },
    { label: "Débil", color: "bg-orange-400" },
    { label: "Regular", color: "bg-yellow-400" },
    { label: "Segura", color: "bg-green-500" },
  ];

  const isPasswordSecure = passwordStrength >= 3;
  const errors = state?.error as any;

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-[#FEFAE0] rounded-2xl shadow-xl border border-[#DDA15E]/20">
      <h2 className="text-3xl font-bold mb-2 text-center text-[#283618]">
        Create Account
      </h2>
      <p className="text-center text-[#606C38] mb-8 text-sm">
        Join our community of artisans
      </p>

      {/* Added ref={formRef} */}
      <form ref={formRef} action={dispatch} className="space-y-5">
        {/* Success Message */}
        {state?.success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-start gap-3"
          >
            <CheckCircle2 className="shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm">
                {state.success}{" "}
                <a href="/login" className="underline font-bold">
                  Log in
                </a>
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#283618] mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full p-3 rounded-lg border border-[#DDA15E] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25] transition-all text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#283618] mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@example.com"
              className="w-full p-3 rounded-lg border border-[#DDA15E] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25] transition-all text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#283618] mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-lg border border-[#DDA15E] bg-white outline-none focus:ring-2 focus:ring-[#BC6C25] transition-all text-black"
            />

            {/* Strength Bar */}
            <div className="mt-3 space-y-2">
              <div className="flex gap-1 h-1.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-500 ${
                      i < passwordStrength
                        ? strengthMeta[passwordStrength - 1].color
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              {password && (
                <div className="flex justify-between items-center text-[10px]">
                  <p
                    className={`font-bold uppercase ${isPasswordSecure ? "text-green-600" : "text-orange-600"}`}
                  >
                    Fortaleza: {strengthMeta[passwordStrength - 1]?.label}
                  </p>
                  {!isPasswordSecure && (
                    <span className="text-orange-600 flex items-center gap-1">
                      <ShieldAlert size={12} /> Mezcla letras, números y
                      símbolos
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="relative flex p-1 bg-[#E9EDC6] rounded-xl">
          <motion.div
            className="absolute top-1 bottom-1 left-1 rounded-lg bg-white shadow-sm"
            animate={{
              x: role === "USER" ? "0%" : "100%",
              width: "calc(50% - 4px)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            type="button"
            onClick={() => setRole("USER")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold ${role === "USER" ? "text-[#283618]" : "text-[#606C38]"}`}
          >
            <User size={18} /> Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("SELLER")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold ${role === "SELLER" ? "text-[#283618]" : "text-[#606C38]"}`}
          >
            <Store size={18} /> Artisan
          </button>
          <input type="hidden" name="role" value={role} />
        </div>

        <button
          type="submit"
          disabled={!isPasswordSecure}
          className="w-full py-3 px-4 bg-[#BC6C25] hover:bg-[#A65D1F] text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          {isPasswordSecure ? "Sign Up" : "Improve your password"}
        </button>

        {errors?.root && (
          <p className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium italic">
            {errors.root}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-[#606C38]">
        Already have an account?{" "}
        <a href="/login" className="text-[#BC6C25] font-bold hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
