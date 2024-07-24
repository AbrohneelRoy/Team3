import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();


      const loggedInUser = localStorage.getItem('username');
  

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };



  return (
    <div >
      <header >
        <div >
          <div onClick={toggleDropdown}>
            {loggedInUser}             
            <div className={` ${dropdownOpen ? dropdownOpen : ''}`}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div >
        <div >
        <h1>Welcome, {loggedInUser}!</h1>
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