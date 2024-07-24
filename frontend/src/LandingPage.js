import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <header>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </header>
      <div>
        <h1>Welcome to Our Application</h1>
        <p>Please login or register to continue.</p>
      </div>
    </div>
  );
};

export default LandingPage;
