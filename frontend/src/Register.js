import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem('username');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDash = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
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
    <div >
      <header >
        <div >

          <div  onClick={toggleDropdown}>
            {loggedInUser}             
            <div className={` ${dropdownOpen ? dropdownOpen : ''}`}>
              <button onClick={handleDash}>Dashboard</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>


        </div>
      </header>
      <div >
        <div >
          <div >
            <h2 >Register</h2>
            <form onSubmit={handleSubmit}>
              <div >
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
              <div >
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
              <div >
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
              <div >
                <label>Role:</label>
                <div >
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    Admin
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={role === 'user'}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                    User
                  </label>
                </div>

              </div>
              <button type="submit" >Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;