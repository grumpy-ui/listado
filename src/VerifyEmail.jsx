import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="app container">
      <h1>Verify your email</h1>
      <p>We've sent a verification link to your email. Please verify and then log in.</p>
      <button className="add-button" onClick={() => navigate('/')}>
        Go to Login
      </button>
    </div>
  );
};

export default VerifyEmail;
