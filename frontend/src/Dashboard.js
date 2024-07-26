import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css';
import nav1 from './home.png'; 
import nav11 from './homehover.png'; 
import nav2 from './calendar.png'; 
import nav22 from './calendarhover.png'; 
import nav3 from './task.png'; 
import nav33 from './taskhoover.png'; 
import nav4 from './note.png'; 
import nav44 from './notehover.png'; 
import nav6 from './logout.png'; 
import nav66 from './logouthover.png'; 

const Dashboard = () => {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  const routeTask = () => {
    navigate('/Task');
  };

  const routeCalendar = () => {
    navigate('/Calendar');
  };

  const routeNote = () => {
    navigate('/Notes');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="db-container">
      <header className="db-header">
        <div className="db-logo">Chrono Craft</div>
        <span style={{ fontSize: '1.6em', color: '#18bc9c' }}>{loggedInUser}</span>
      </header>
      <div className="db-main">
        <nav className="db-sidebar">
          <button
            className={`db-nav-button ${isActive('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate('/Dashboard')}
          >
            <img src={hovered === 'home' || isActive('/Dashboard') ? nav11 : nav1} alt="Home" className="db-nav-icon" />Dashboard
          </button>          
          <button
            className={`db-nav-button ${isActive('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeCalendar}
          >
            <img src={hovered === 'calendar' || isActive('/Calendar') ? nav22 : nav2} alt="Calendar" className="db-nav-icon" />Calendar
          </button>          
          <button
            className={`db-nav-button ${isActive('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeTask}
          >
            <img src={hovered === 'task' || isActive('/Task') ? nav33 : nav3} alt="Tasks" className="db-nav-icon" />To-Do
          </button>          
          <button
            className={`db-nav-button ${isActive('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeNote}
          >
            <img src={hovered === 'note' || isActive('/Notes') ? nav44 : nav4} alt="Notes" className="db-nav-icon" />Notes
          </button>          
          <button
            className={`db-nav-button ${isActive('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActive('/logout') ? nav66 : nav6} alt="Logout" className="db-nav-icon" />Logout
          </button>  
        </nav>
        <div className="db-content">
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
