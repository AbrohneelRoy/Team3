import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Task.css'; // Reusing the same CSS file for consistent styling
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

const Task = () => {
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

  const routeToNotes = () => {
    navigate('/Notes');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="task-container">
      <header className="task-header">
        <div className="task-logo">Chrono Craft</div>
        <span style={{ fontSize: '1.6em', color: '#18bc9c' }}>{loggedInUser}</span>
      </header>
      <div className="task-main">
        <nav className="task-sidebar">
          <button
            className={`task-nav-button ${isActive('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActive('/Dashboard') ? nav11 : nav1} alt="Dashboard" className="task-nav-icon" /> Dashboard
          </button>          
          <button
            className={`task-nav-button ${isActive('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToCalendar}
          >
            <img src={hovered === 'calendar' || isActive('/Calendar') ? nav22 : nav2} alt="Calendar" className="task-nav-icon" /> Calendar
          </button>          
          <button
            className={`task-nav-button ${isActive('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'task' || isActive('/Task') ? nav33 : nav3} alt="Tasks" className="task-nav-icon" /> To-Do
          </button>          
          <button
            className={`task-nav-button ${isActive('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActive('/Notes') ? nav44 : nav4} alt="Notes" className="task-nav-icon" /> Notes
          </button>          
          <button
            className={`task-nav-button ${isActive('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActive('/logout') ? nav66 : nav6} alt="Logout" className="task-nav-icon" /> Logout
          </button>          
        </nav>
        <div className="task-content">
          <h1>Task Management</h1>
          <p>Here you can manage your tasks efficiently. Use the sidebar to navigate to different sections.</p>
        </div>
      </div>
    </div>
  );
};

export default Task;
