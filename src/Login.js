import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './lpstyle.css'; 
import loimg from './loginimg.png'; 


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Login failed: Invalid username or password.');
        } else {
          alert(`Login failed: Server responded with status ${response.status}.`);
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('username', username);
        navigate('/Dashboard');
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Login failed: Network error or server not responding.');
    }
  };
  const handleSignUp = () => {
    navigate('/Register');
  };

  return (
    <div className="lp-container">
      <header className="lp-header">
        <div className="lp-logo">ChronoCraft</div>
        <nav className="lp-navigation">
          <Link to="/" className="lp-link">Home</Link>

        </nav>
        <button onClick={handleSignUp} className="lp-get-started-btn">SIGN UP</button>
      </header>
      <main className="lp-main-content">
        <div className="login-container">
          <div classname="login-left">
        <img src={loimg} alt="Landing Page" className="lo-image" />
        </div>
        <div className="login right">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="username" className="login-label">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            <button type="submit" className="login-submit-btn">Login</button>
          </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;