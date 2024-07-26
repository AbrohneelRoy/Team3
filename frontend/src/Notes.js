import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Dashboard.css'; // Reusing the same CSS file for consistent styling
import './Notes.css';
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

const Notes = () => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/Login', { replace: true });
  };

  const routeToDashboard = () => {
    navigate('/Dashboard');
  };

  const routeToCalendar = () => {
    navigate('/Calendar');
  };

  const routeToTask = () => {
    navigate('/Task');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="no-container">
      <header className="no-header">
        <div className="no-logo">Chrono Craft</div>
        <span style={{ fontSize: '1.6em', color: '#18bc9c' }}>{loggedInUser}</span>
      </header>
      <div className="no-main">
        <nav className="no-sidebar">
          <button
            className={`no-nav-button ${isActive('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActive('/Dashboard') ? nav11 : nav1} alt="Dashboard" className="no-nav-icon" /> Dashboard
          </button>
          <button
            className={`no-nav-button ${isActive('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToCalendar}
          >
            <img src={hovered === 'calendar' || isActive('/Dalendar') ? nav22 : nav2} alt="Calendar" className="no-nav-icon" /> Calendar
          </button>
          <button
            className={`no-nav-button ${isActive('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTask}
          >
            <img src={hovered === 'task' || isActive('/Task') ? nav33 : nav3} alt="Tasks" className="no-nav-icon" /> To-Do
          </button>
          <button
            className={`no-nav-button ${isActive('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'note' || isActive('/Notes') ? nav44 : nav4} alt="Notes" className="no-nav-icon" /> Notes
          </button>
          <button
            className={`no-nav-button ${isActive('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActive('/logout') ? nav66 : nav6} alt="Logout" className="no-nav-icon" /> Logout
          </button>
        </nav>
        <div className="no-content">
          <h1>Notes Management</h1>
          <p>Here you can manage your notes. Use the sidebar to navigate to different sections.</p>
        </div>
      </div>
    </div>
  );
};

export default Notes;
