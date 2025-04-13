import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const checkVerification = async () => {
    setChecking(true);
    await auth.currentUser.reload(); // refresh user from Firebase
    if (auth.currentUser.emailVerified) {
      navigate("/");
    } else {
      alert("Still not verified. Please click the link in your email.");
    }
    setChecking(false);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        clearInterval(interval);
        navigate("/");
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="app container">
      <h1>Verify your email</h1>
      <p>We've sent a verification link to your email. Please click it to continue.</p>

      <button className="add-button" onClick={checkVerification} disabled={checking}>
        {checking ? "Checking..." : "I've Verified My Email"}
      </button>
    </div>
  );
};

export default VerifyEmail;
