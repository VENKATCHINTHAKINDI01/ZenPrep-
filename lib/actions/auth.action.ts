"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session lasts 1 week (in seconds)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// ── Set session cookie after Firebase login ──
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Firebase Admin creates a secure session cookie from the ID token
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // Firebase expects milliseconds
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,    // browser expiry in seconds
    httpOnly: true,              // JS can't read this cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    path: "/",
    sameSite: "lax",
  });
}

// ── Create new user account ──
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // Check if user already exists in Firestore
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Save new user to Firestore users collection
    // uid is used as doc ID so we can look up by Firebase Auth UID
    await db.collection("users").doc(uid).set({
      name,
      email,
      preferredLanguage: "en-IN", // default to English
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "This email is already in use" };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// ── Sign in existing user ──
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    // Exchange Firebase ID token for a session cookie
    await setSessionCookie(idToken);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// ── Sign out: delete session cookie ──
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// ── Get current logged-in user from session ──
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    // Verify the session cookie cryptographically
    // true = check if token was revoked
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Fetch user data from Firestore using decoded UID
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id, // attach Firestore document ID as 'id'
    } as User;
  } catch (error) {
    // Session invalid or expired
    return null;
  }
}

// ── Simple boolean auth check (used in layouts) ──
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}