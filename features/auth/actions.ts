"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { LoginSchema, RegisterSchema } from "./schemas";
import { prisma } from "@/app/lib/prisma";

/**
 * Server Action to handle new user registration.
 *
 * It performs the following steps:
 * 1. Validates form data using Zod.
 * 2. Checks if the email is already taken.
 * 3. Hashes the password for security.
 * 4. Creates the user record in MongoDB.
 *
 * @param prevState - The previous state of the form (required by the useFormState hook).
 * @param formData - The raw data coming from the HTML form.
 * @returns An object containing either success messages or validation errors.
 */
export async function registerUser(prevState: any, formData: FormData) {
  // 1. Validate form fields using Zod Schema
  // We convert formData to a plain object to validate it against the schema
  const validation = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role")?.toString(),
  });

  // If validation fails, return the specific field errors to the UI
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Extract validated data
  const { name, email, password, role } = validation.data;

  try {
    // 2. Check for existing user
    // We must ensure the email is unique in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { error: { email: ["Email already in use. Try logging in."] } };
    }

    // 3. Hash the password
    // SECURITY CRITICAL: Never store plain text passwords in the database.
    // The second argument (10) is the salt rounds (cost factor).
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user in Database (MongoDB via Prisma)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        onboardingCompleted: true,
      },
    });

    if (role == "SELLER") {
      await prisma.seller.create({
        data: {
          name,
          email,
          profileImage: "/images/default_pfp.webp",
          heroBanner: "/images/placeholder.webp",
          category: "Madera",
        },
      });
    }

    return { success: "Account created! You can now log in." };
  } catch (error) {
    console.log(error);
    // Generic error handler to prevent leaking sensitive DB errors to the client
    return { error: { root: ["Something went wrong. Please try again."] } };
  }
}

/**
 * Server Action to handle user login via Credentials (Email/Password).
 *
 * It uses NextAuth's `signIn` method. If successful, NextJS redirects automatically.
 * If it fails, we catch the error to display it on the frontend.
 *
 * @param prevState - The previous state of the form.
 * @param formData - The raw form data.
 */
export async function loginUser(prevState: any, formData: FormData) {
  // 1. Validate input format
  const validation = LoginSchema.safeParse(Object.fromEntries(formData));

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const { email, password } = validation.data;

  try {
    // 2. Attempt to sign in using NextAuth Credentials provider
    // This triggers the `authorize` function defined in your `auth.ts` config
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", // Target route upon successful login
    });
  } catch (error) {
    // 3. Error Handling
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // This specific error means the password or email was incorrect
          return {
            error: { root: ["Invalid credentials. Check email or password."] },
          };
        default:
          return { error: { root: ["Something went wrong."] } };
      }
    }

    // CRITICAL: Next.js Redirects are technically thrown errors.
    // We MUST re-throw the error if it's not an AuthError, otherwise
    // the redirect to "/dashboard" will be blocked and the user will stay on the login page.
    throw error;
  }
}

/**
 * Server Action to initiate Google OAuth login.
 *
 * This function triggers the standard OAuth flow. The user will be redirected
 * to Google's consent screen.
 */
export async function loginGoogle() {
  await signIn("google", { redirectTo: "/onboarding" });
}

/**
 * Handles the completion of the onboarding process for social login users.
 * 
 * Logic Breakdown:
 * 1. Verification: Asserts that a valid session exists.
 * 2. Database Update: Assigns the selected Role and marks onboarding as done.
 * 3. Business Logic: If the user is an Artisan (SELLER), it initializes their store profile.
 * 4. Cache Management: Triggers path revalidation to update global UI state.
 * 
 * @param role - The identity the user chose during onboarding.
 * @returns Status object used by the client UI.
 */
export async function completeOnboarding(role: "USER" | "SELLER") {
  try {
    const { auth } = await import("@/auth");
    const sessionData = await auth();

    // Guard: Ensure user is actually authenticated
    if (!sessionData?.user?.email) {
      return { error: "Authorization failed. Please sign in again." };
    }

    const email = sessionData.user.email;
    console.log(`[Auth] User ${email} completed onboarding as ${role}`);

    // Phase 1: Persistence
    // Mark the user as 'onboarded' to unlock the rest of the application
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role,
        onboardingCompleted: true,
      },
    });

    // Phase 2: Artisan Provisioning
    // If the user is a Seller, we must ensure they have a linked 'Seller' document
    if (role === "SELLER") {
      const existingSeller = await prisma.seller.findFirst({
        where: { email }
      });

      if (!existingSeller) {
        await prisma.seller.create({
          data: {
            name: updatedUser.name || "Newly Joined Artisan",
            email: updatedUser.email!,
            profileImage: updatedUser.image || "/images/default_pfp.webp",
            heroBanner: "/images/placeholder.webp",
            category: "General", // Default assignment
            bio: "Welcome to my creative space! I'm excited to share my hand-crafted work with you.",
          },
        });
      }
    }

    // Phase 3: Cache Invalidation
    // Ensures the Middleware and Layouts fetch the fresh session data on the next request.
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/");

    return { 
      success: true, 
      user: { role, onboardingCompleted: true } 
    };
  } catch (error) {
    console.error("[Fatal] Onboarding Action Failed:", error);
    return { error: "A server-side error occurred while updating your profile. Check the terminal for details." };
  }
}
