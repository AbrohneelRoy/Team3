import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './lpstyle.css'; 
import reimg from './reg.png'; 


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role: 'user' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate('/Login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  const handleSignIn = () => {
    navigate('/Login');
  };

  return (
    <div className="lp-container">
      <header className="lp-header">
        <div className="lp-logo">ChronoCraft</div>
        <nav className="lp-navigation">
          <Link to="/" className="lp-link">Home</Link>
          <Link to="/about" className="lp-link">About</Link>
          <Link to="/service" className="lp-link">Service</Link>
          <Link to="/contact-us" className="lp-link">Contact Us</Link>
          <Link to="/faq" className="lp-link">FAQ</Link>
        </nav>
        <button onClick={handleSignIn} className="lp-get-started-btn">SIGN IN</button>
      </header>
      <div className="register-main-content">
        <div className="register-container">
          
          <div className="login right">
          <h2 className="register-title">Register</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="username" className="register-label">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="register-input"
                required
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="email" className="register-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
                required
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="password" className="register-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
                required
              />
            </div>
            <button type="submit" className="register-submit-btn">Register</button>
          </form>
          </div>
          <div classname="login-left">
          <img src={reimg} alt="Landing Page" className="re-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
