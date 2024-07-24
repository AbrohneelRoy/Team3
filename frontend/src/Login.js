import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  
    return (
      <div >
        <div >
          <div >
            <div >
              <h2>Login</h2>
              <form  onSubmit={handleSubmit}>
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
                <button type="submit" >Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;