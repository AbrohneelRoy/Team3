import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const loggedInUser = localStorage.getItem('username');
  
      const currentUser = response.data.find(user => user.username === loggedInUser);
  
      if (currentUser) {
        setUsername(currentUser.username);
        setRole(currentUser.role);
      } else {
        console.error('User not found in API response');
      }
  
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };



  useEffect(() => {
    fetchUserInfo();
  }, []);

  
  

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div >
      <header >
        <div >
          <div onClick={toggleDropdown}>
            {username}             
            <div className={` ${dropdownOpen ? dropdownOpen : ''}`}>
              {role === 'admin' && <button onClick={handleRegister}>Register</button>}              
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div >
        <div >
        <h1>Welcome, {username}!</h1>
        <p>
          We are thrilled to have you here. Navigate through our application seamlessly and efficiently.
          Should you need any assistance, feel free to reach out. Have a great day!
        </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;