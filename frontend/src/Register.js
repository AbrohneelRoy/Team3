import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('username');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDash = () => {
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://172.19.75.191:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role: 'user' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };

  return (
    <div>
      <header>
        <div>
          <div onClick={toggleDropdown}>
            {loggedInUser}
            <div className={` ${dropdownOpen ? 'dropdown-open' : ''}`}>
              <button onClick={handleDash}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div>
        <div>
          <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
