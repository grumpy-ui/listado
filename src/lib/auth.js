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
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  console.log("=== Authentication Setup Diagnostic ===");
  console.log("Device type:", isMobile ? "Mobile" : "Desktop");
  console.log("User agent:", navigator.userAgent);
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
    isMobile,
    authDomain: auth.config.authDomain,
    projectId: auth.config.projectId,
    currentUrl: window.location.href,
  };
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    // Check if we're on a mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    console.log("Device type:", isMobile ? "Mobile" : "Desktop");
    console.log("User agent:", navigator.userAgent);

    if (isMobile) {
      // Use redirect for mobile devices
      console.log("Using redirect for mobile authentication");
      console.log("Current URL before redirect:", window.location.href);

      await signInWithRedirect(auth, googleProvider);
      console.log("Redirect initiated");
      return { user: null, error: null }; // Redirect will handle the rest
    } else {
      // Use popup for desktop devices
      console.log("Using popup for desktop authentication");
      const result = await signInWithPopup(auth, googleProvider);
      return { user: result.user, error: null };
    }
  } catch (error) {
    console.error("Google sign-in error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    // If popup is blocked on desktop, try redirect
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/popup-closed-by-user"
    ) {
      try {
        console.log("Popup blocked, trying redirect...");
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
