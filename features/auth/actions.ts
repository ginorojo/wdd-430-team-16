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
  const validation = RegisterSchema.safeParse(Object.fromEntries(formData));

  // If validation fails, return the specific field errors to the UI
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // Extract validated data
  const { name, email, password } = validation.data;

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
        role: "USER", // Default role for new sign-ups
      },
    });

    return { success: "Account created! You can now log in." };
  } catch (error) {
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
      redirectTo: "/dashboard", // Target route upon successful login
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
  await signIn("google", { redirectTo: "/dashboard" });
}
