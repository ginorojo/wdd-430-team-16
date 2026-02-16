/**
 * @file app/onboarding/page.tsx
 * @description Mandatory role-selection page for users entering via social login.
 * This page serves as a profile "activator" before granting full access.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { completeOnboarding } from "@/features/auth/actions";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Hammer, Check, ArrowRight, Sparkles } from "lucide-react";

/**
 * OnboardingPage Component
 * 
 * A high-premium, accessible role selection screen.
 * 
 * UI Strategy:
 * - Minimalist cards to reduce cognitive load.
 * - Earth-tone palette (Artisanal branding).
 * - Smooth Framer Motion transitions.
 * 
 * Security Strategy:
 * - Blocked by middleware if onboardingCompleted is false.
 * - Client-side session refresh after selection.
 */
export default function OnboardingPage() {
    const router = useRouter();
    const { update } = useSession();

    /** @state selectedRole - Local selection state before confirmation */
    const [selectedRole, setSelectedRole] = useState<"USER" | "SELLER" | null>(null);

    /** @state isSubmitting - Handles the loading state of the Server Action */
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** @state error - UI feedback for any server errors */
    const [error, setError] = useState<string | null>(null);

    /** @state hasFinished - Indicates the process is complete, waiting for redirect */
    const [hasFinished, setHasFinished] = useState(false);

    /**
     * Executes the onboarding completion logic.
     * 1. Updates MongoDB via Server Action.
     * 2. Force-refreshes the local session to update JWT/Cookies.
     * 3. Redirects to landing page with updated permissions.
     */
    const handleOnboarding = async () => {
        if (!selectedRole || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            console.log("[Onboarding] Initiating server update...");
            const result = await completeOnboarding(selectedRole);

            if (result.success) {
                console.log("[Onboarding] Server update success. Syncing session...");

                // IMPORTANT: We must update the session client-side so the Navbar/Middleware
                // immediately recognizes the new role and onboarding status.
                const newSession = await update({
                    role: selectedRole,
                    onboardingCompleted: true
                });

                console.log("[Onboarding] Session update call complete", newSession);
                setHasFinished(true);

                // Allow a brief moment for the user to see the "Success" state
                setTimeout(() => {
                    // Full page redirect to ensure the Middleware re-evaluates the session
                    console.log("[Onboarding] Executing final redirect...");
                    window.location.href = "/";
                }, 1000);
            } else {
                setError(result.error || "An unexpected error occurred.");
                setIsSubmitting(false);
            }
        } catch (e) {
            console.error("Onboarding UI Error:", e);
            setError("Something went wrong during the update. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3E7] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* --- VISUAL DECORATIONS --- */}
            {/* Abstract background blurs for aesthetic appeal */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#BC6C25]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#283618]/5 rounded-full blur-[100px]" />

            <div className="max-w-4xl w-full relative z-10">
                {/* --- HEADER --- */}
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Informative badge for context */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-[#EADDCA]/50 mb-6 mx-auto">
                            <Sparkles size={14} className="text-[#BC6C25]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BC6C25]">Step 1: Identity</span>
                        </div>
                        {/* Main title */}
                        <h1 className="text-5xl font-black text-[#283618] tracking-tight mb-4">
                            Welcome to the Refuge
                        </h1>
                        {/* Subtitle/description */}
                        <p className="text-[#5C4033]/60 text-lg font-medium max-w-xl mx-auto">
                            Before we begin discovery, let us know how you'd like to join our community.
                        </p>
                    </motion.div>
                </header>

                {/* --- ROLE SELECTION CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* OPTION: CUSTOMER */}
                    <RoleCard
                        id="USER"
                        title="I am a Customer"
                        description="I want to discover and buy unique handmade art from the best local artisans."
                        Icon={ShoppingBag}
                        isSelected={selectedRole === "USER"}
                        onSelect={() => setSelectedRole("USER")}
                        accentColor="bg-[#BC6C25]"
                        borderColor="border-[#BC6C25]"
                    />

                    {/* OPTION: ARTISAN */}
                    <RoleCard
                        id="SELLER"
                        title="I am an Artisan"
                        description="I want to share my creations with the world and manage my own workshop."
                        Icon={Hammer}
                        isSelected={selectedRole === "SELLER"}
                        onSelect={() => setSelectedRole("SELLER")}
                        accentColor="bg-[#283618]"
                        borderColor="border-[#283618]"
                    />
                </div>

                {/* --- ACTION FOOTER --- */}
                <footer className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        {!hasFinished ? (
                            !isSubmitting ? (
                                <motion.button
                                    key="submit-btn"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    onClick={handleOnboarding}
                                    disabled={!selectedRole}
                                    className={`group flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg transition-all shadow-xl active:scale-95 ${selectedRole
                                        ? "bg-[#283618] text-white shadow-[#283618]/20 hover:bg-[#1a2410]"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                        }`}
                                >
                                    <span>Activate My Account</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="loading-state"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="flex items-center gap-4 text-[#283618] font-black">
                                        <div className="w-6 h-6 border-4 border-[#283618]/20 border-t-[#283618] rounded-full animate-spin" />
                                        Preparing your digital workshop...
                                    </div>
                                    <p className="text-[10px] text-[#5C4033]/40 font-bold uppercase tracking-widest">Saving selection to database</p>
                                </motion.div>
                            )
                        ) : (
                            <motion.div
                                key="success-state"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 text-green-800 font-black">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <Check size={14} />
                                    </div>
                                    Sync Complete! Redirecting...
                                </div>

                                <button
                                    onClick={() => window.location.href = "/"}
                                    className="text-xs text-[#BC6C25] font-black underline hover:text-[#8D5F42] transition-colors"
                                >
                                    Didn't redirect? Click here to enter the Refuge
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error message display */}
                    {error && (
                        <p className="mt-4 text-red-600 font-bold text-sm bg-red-50 px-6 py-2 rounded-full border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                            {error}
                        </p>
                    )}

                    {/* Footer legal/branding text */}
                    <p className="mt-12 text-[10px] uppercase font-black tracking-[0.3em] text-[#5C4033]/30">
                        Secure Authentication Protocol • Artisanal Refuge
                    </p>
                </footer>
            </div>
        </div>
    );
}

/**
 * RoleCard Component
 * 
 * A reusable, interactive card for role selection.
 * Encapsulates UI logic for selection state, hover effects, and accessibility.
 * 
 * @param {object} props - Component props.
 * @param {string} props.id - Unique identifier for the role (e.g., "USER", "SELLER").
 * @param {string} props.title - Main title displayed on the card.
 * @param {string} props.description - Detailed description of the role.
 * @param {React.ElementType} props.Icon - Lucide-react icon component for visual representation.
 * @param {boolean} props.isSelected - True if this card is currently selected.
 * @param {() => void} props.onSelect - Callback function when the card is clicked.
 * @param {string} props.accentColor - Tailwind class for the primary accent color (e.g., "bg-blue-500").
 * @param {string} props.borderColor - Tailwind class for the border color when selected (e.g., "border-blue-500").
 */
function RoleCard({ title, description, Icon, isSelected, onSelect, accentColor, borderColor }: {
    id: "USER" | "SELLER";
    title: string;
    description: string;
    Icon: React.ElementType;
    isSelected: boolean;
    onSelect: () => void;
    accentColor: string;
    borderColor: string;
}) {
    return (
        <motion.button
            whileHover={{ y: -5 }} // Lift effect on hover
            whileTap={{ scale: 0.98 }} // Slight press effect on click
            onClick={onSelect} // Handle selection
            aria-pressed={isSelected} // Accessibility attribute
            className={`relative group p-10 rounded-[3rem] text-left transition-all duration-500 border-2 ${isSelected
                ? `bg-white ${borderColor} shadow-2xl` // Highlighted style
                : "bg-white/40 border-transparent hover:bg-white/60 shadow-sm" // Default/hover style
                }`}
        >
            {/* Icon container with dynamic styling */}
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-colors duration-500 ${isSelected ? `${accentColor} text-white` : "bg-[#EADDCA]/20 text-[#BC6C25]"
                }`}>
                <Icon size={32} />
            </div>
            {/* Card title */}
            <h2 className="text-3xl font-black text-[#283618] mb-3">{title}</h2>
            {/* Card description */}
            <p className="text-[#5C4033]/60 font-medium leading-relaxed">
                {description}
            </p>

            {/* Checkmark indicator for selected state */}
            <div className={`absolute top-8 right-8 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isSelected ? "scale-100 opacity-100 bg-[#DDA15E] text-white" : "scale-50 opacity-0 bg-transparent"
                }`}>
                <Check size={20} className="font-bold" />
            </div>
        </motion.button>
    );
}
