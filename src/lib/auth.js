import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

// Initialize authentication and handle any pending redirects
export const initializeAuth = async () => {
  try {
    console.log("Initializing authentication...");
    console.log("Firebase config:", {
      authDomain: auth.config.authDomain,
      projectId: auth.config.projectId,
    });

    // Check for any pending redirect results
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Found redirect result:", result.user.email);
      return { user: result.user, error: null };
    }

    console.log("No redirect result found");
    return { user: null, error: null };
  } catch (error) {
    console.error("Error initializing auth:", error);
    return { user: null, error: error.message };
  }
};

// Diagnostic function to check authentication setup
export const checkAuthSetup = () => {
  console.log("=== Authentication Setup Diagnostic ===");
  console.log("Current URL:", window.location.href);
  console.log("Firebase auth domain:", auth.config.authDomain);
  console.log("Firebase project ID:", auth.config.projectId);
  console.log("Google provider scopes:", googleProvider.scopes);
  console.log(
    "Google provider custom parameters:",
    googleProvider.customParameters
  );
  console.log("=======================================");

  return {
    authDomain: auth.config.authDomain,
    projectId: auth.config.projectId,
    currentUrl: window.location.href,
  };
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign-in...");

    // Try popup first (works on most devices)
    try {
      console.log("Attempting popup authentication...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Popup authentication successful:", result.user.email);
      return { user: result.user, error: null };
    } catch (popupError) {
      console.log("Popup failed, trying redirect...", popupError.code);

      // If popup fails, use redirect
      if (
        popupError.code === "auth/popup-blocked" ||
        popupError.code === "auth/popup-closed-by-user" ||
        popupError.code === "auth/cancelled-popup-request"
      ) {
        console.log("Using redirect authentication...");
        await signInWithRedirect(auth, googleProvider);
        return { user: null, error: null }; // Redirect will handle the rest
      } else {
        // Re-throw other errors
        throw popupError;
      }
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
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
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Redirect result successful:", result.user);
      return { user: result.user, error: null };
    }
    return { user: null, error: null };
  } catch (error) {
    console.error("Redirect result error:", error);
    return { user: null, error: error.message };
  }
};

// Test Firebase configuration
export const testFirebaseConfig = async () => {
  try {
    console.log("=== Testing Firebase Configuration ===");
    console.log("Auth domain:", auth.config.authDomain);
    console.log("Current hostname:", window.location.hostname);
    console.log("Current origin:", window.location.origin);

    // Test if we can access the auth domain
    const testUrl = `https://${auth.config.authDomain}`;
    console.log("Testing auth domain:", testUrl);

    // Try to get the current user (this will test the connection)
    const currentUser = auth.currentUser;
    console.log("Current user:", currentUser ? currentUser.email : "None");

    console.log("Firebase configuration test completed");
    return { success: true, currentUser };
  } catch (error) {
    console.error("Firebase configuration test failed:", error);
    return { success: false, error: error.message };
  }
};
