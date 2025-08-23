import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    // Check if we're on a mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // Use redirect for mobile devices
      await signInWithRedirect(auth, googleProvider);
      return { user: null, error: null }; // Redirect will handle the rest
    } else {
      // Use popup for desktop devices
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    }
  } catch (error) {
    console.error("Google sign-in error:", error);

    // If popup is blocked on desktop, try redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null }; // Redirect will handle the rest
      } catch (redirectError) {
        console.error("Google redirect sign-in error:", redirectError);
        return { user: null, error: redirectError.message };
      }
    }

    return { user: null, error: error.message };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Handle redirect result (for mobile devices)
export const handleRedirectResult = async () => {
  try {
    const { getRedirectResult } = await import("firebase/auth");
    const result = await getRedirectResult(auth);
    if (result) {
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (error) {
    console.error("Redirect result error:", error);
    return { user: null, error: error.message };
  }
};
