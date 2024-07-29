import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AIScheduler.css';
import nav1 from './home.png';
import nav11 from './homehover.png';
import nav2 from './calendar.png';
import nav22 from './calendarhover.png';
import nav3 from './task.png';
import nav33 from './taskhoover.png';
import nav4 from './note.png';
import nav44 from './notehover.png';
import nav5 from './timer.png';
import nav55 from './timerhover.png';
import nav6 from './logout.png';
import nav66 from './logouthover.png';
import nav7 from './gpt.png';
import nav77 from './gpthover.png';
import micIcon from './mic.png';
import micHover from './michover.png';

const AIScheduler = () => {
  const [hovered, setHovered] = useState(null);
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login', { replace: true });
  };

  const handleGenerate = () => {
    console.log('Generate button clicked with prompt:', prompt);
  };

  const handleMicClick = () => {
    console.log('Microphone button clicked');
  };

  const routeToDashboard = () => navigate('/Dashboard');
  const routeToCalendar = () => navigate('/Calendar');
  const routeToTask = () => navigate('/Task');
  const routeToNotes = () => navigate('/Notes');
  const routeToTimer = () => navigate('/Timer');

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="ai-container">
      <header className="ai-header">
        <div className="ai-logo">Chrono Craft</div>
        <span className="ai-username">{loggedInUser}</span>
      </header>
      <div className="ai-main">
        <nav className="ai-sidebar">
          <button
            className={`ai-nav-button ${isActiveRoute('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActiveRoute('/Dashboard') ? nav11 : nav1} alt="Dashboard" className="ai-nav-icon" /> Dashboard
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToCalendar}
          >
            <img src={hovered === 'calendar' || isActiveRoute('/Calendar') ? nav22 : nav2} alt="Calendar" className="ai-nav-icon" /> Calendar
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTask}
          >
            <img src={hovered === 'task' || isActiveRoute('/Task') ? nav33 : nav3} alt="Tasks" className="ai-nav-icon" /> To-Do
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActiveRoute('/Notes') ? nav44 : nav4} alt="Notes" className="ai-nav-icon" /> Notes
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Timer') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('timer')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTimer}
          >
            <img src={hovered === 'timer' || isActiveRoute('/Timer') ? nav55 : nav5} alt="Timer" className="ai-nav-icon" /> Pomodoro Timer
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/AIScheduler') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'gpt' || isActiveRoute('/AIScheduler') ? nav77 : nav7} alt="AIScheduler" className="time-nav-icon" /> AIScheduler
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActiveRoute('/logout') ? nav66 : nav6} alt="Logout" className="ai-nav-icon" /> Logout
          </button>
        </nav>
        <div className="ai-content">
          <h1>AI Scheduler</h1>
          <p>Manage your schedule with the AI Scheduler. Optimize your time with smart suggestions.</p>
          <div className="ai-prompt-container">
            <textarea
              className="ai-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            />
            <button
              className="ai-mic-button"
              onClick={handleMicClick}
              onMouseEnter={() => setHovered('mic')}
              onMouseLeave={() => setHovered(null)}
            >
              <img src={hovered === 'mic' ?  micHover : micIcon} alt="Mic" />
            </button>
          </div>
            <button className="ai-generate-button" onClick={handleGenerate}>Generate</button>
        </div>
      </div>
    </div>
  );
};

export default AIScheduler;
