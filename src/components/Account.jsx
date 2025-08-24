import { useState, useEffect } from "react";
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getCurrentUser,
  onAuthStateChange,
} from "../lib/auth";
import "./Account.css";

function Account({ onClose, language }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const translations = {
    en: {
      account: "Account",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      orSignInWith: "Or sign in with",
      orSignUpWith: "Or sign up with",
      googleSignIn: "Sign in with Google",
      googleSignUp: "Sign up with Google",
      alreadyHaveAccount: "Already have an account? Sign in",
      dontHaveAccount: "Don't have an account? Sign up",
      welcome: "Welcome",
      signedInAs: "Signed in as",
      close: "Close",
      loading: "Loading...",
      passwordsDontMatch: "Passwords don't match",
      invalidEmail: "Invalid email address",
      weakPassword: "Password should be at least 6 characters",
      emailInUse: "Email already in use",
      userNotFound: "User not found",
      wrongPassword: "Wrong password",
      tooManyRequests: "Too many failed attempts. Try again later",
    },
    ro: {
      account: "Cont",
      signIn: "Conectare",
      signUp: "Înregistrare",
      signOut: "Deconectare",
      email: "Email",
      password: "Parolă",
      confirmPassword: "Confirmă parola",
      orSignInWith: "Sau conectează-te cu",
      orSignUpWith: "Sau înregistrează-te cu",
      googleSignIn: "Conectare cu Google",
      googleSignUp: "Înregistrare cu Google",
      alreadyHaveAccount: "Ai deja un cont? Conectează-te",
      dontHaveAccount: "Nu ai cont? Înregistrează-te",
      welcome: "Bun venit",
      signedInAs: "Conectat ca",
      close: "Închide",
      loading: "Se încarcă...",
      passwordsDontMatch: "Parolele nu se potrivesc",
      invalidEmail: "Adresă de email invalidă",
      weakPassword: "Parola trebuie să aibă cel puțin 6 caractere",
      emailInUse: "Email-ul este deja folosit",
      userNotFound: "Utilizatorul nu a fost găsit",
      wrongPassword: "Parolă greșită",
      tooManyRequests:
        "Prea multe încercări eșuate. Încearcă din nou mai târziu",
    },
    es: {
      account: "Cuenta",
      signIn: "Iniciar sesión",
      signUp: "Registrarse",
      signOut: "Cerrar sesión",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      orSignInWith: "O inicia sesión con",
      orSignUpWith: "O registrarse con",
      googleSignIn: "Iniciar sesión con Google",
      googleSignUp: "Registrarse con Google",
      alreadyHaveAccount: "¿Ya tienes cuenta? Inicia sesión",
      dontHaveAccount: "¿No tienes cuenta? Regístrate",
      welcome: "Bienvenido",
      signedInAs: "Conectado como",
      close: "Cerrar",
      loading: "Cargando...",
      passwordsDontMatch: "Las contraseñas no coinciden",
      invalidEmail: "Dirección de email inválida",
      weakPassword: "La contraseña debe tener al menos 6 caracteres",
      emailInUse: "El email ya está en uso",
      userNotFound: "Usuario no encontrado",
      wrongPassword: "Contraseña incorrecta",
      tooManyRequests: "Demasiados intentos fallidos. Inténtalo más tarde",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    console.log("Starting Google authentication...");
    const { user, error } = await signInWithGoogle();

    if (error) {
      console.error("Google auth error:", error);
      setError(getErrorMessage(error));
    } else {
      console.log("Google auth successful:", user);
      onClose();
    }

    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!email || !password) {
      setError(t.invalidEmail);
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t.passwordsDontMatch);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.weakPassword);
      setLoading(false);
      return;
    }

    const { user, error } = isSignUp
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);

    if (error) {
      setError(getErrorMessage(error));
    } else {
      onClose();
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOutUser();
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  const getErrorMessage = (error) => {
    if (error.includes("email-already-in-use")) return t.emailInUse;
    if (error.includes("user-not-found")) return t.userNotFound;
    if (error.includes("wrong-password")) return t.wrongPassword;
    if (error.includes("too-many-requests")) return t.tooManyRequests;
    if (error.includes("weak-password")) return t.weakPassword;
    if (error.includes("invalid-email")) return t.invalidEmail;
    return error;
  };

  if (user) {
    return (
      <div className="account-modal">
        <div className="account-content">
          <div className="account-header">
            <h2>{t.account}</h2>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="account-body">
            <div className="user-info">
              <div className="user-avatar">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{t.welcome}!</h3>
                <p>{t.signedInAs}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>

            <button
              className="sign-out-button"
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? t.loading : t.signOut}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-modal">
      <div className="account-content">
        <div className="account-header">
          <h2>{isSignUp ? t.signUp : t.signIn}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="account-body">
          <form onSubmit={handleEmailAuth}>
            <div className="form-group">
              <label htmlFor="email">{t.email}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">{t.confirmPassword}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? t.loading : isSignUp ? t.signUp : t.signIn}
            </button>
          </form>

          <div className="divider">
            <span>{isSignUp ? t.orSignUpWith : t.orSignInWith}</span>
          </div>

          <button
            className="google-button"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
            {isSignUp ? t.googleSignUp : t.googleSignIn}
          </button>

          <div className="toggle-auth">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
