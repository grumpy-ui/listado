import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontFamily: "Patrick Hand, cursive",
            backgroundColor: "#fff8dc",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>😵 Something went wrong</h2>
          <p>
            Don't worry, it's not your fault! The app encountered an unexpected
            error.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#5f7fff",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "8px",
              fontFamily: "Patrick Hand, cursive",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            🔄 Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
