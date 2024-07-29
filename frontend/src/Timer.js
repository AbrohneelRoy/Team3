import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Timer.css';
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


const Timer = () => {
  const [hovered, setHovered] = useState(null);
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('time');
    return savedTime ? JSON.parse(savedTime) : 25 * 60; // Default to 25 minutes for Pomodoro
  });
  const [isActive, setIsActive] = useState(() => JSON.parse(localStorage.getItem('isActive')) || false);
  const [isBreak, setIsBreak] = useState(() => JSON.parse(localStorage.getItem('isBreak')) || false);
  const [intervalId, setIntervalId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login', { replace: true });
  };

  const routeToDashboard = () => navigate('/Dashboard');
  const routeToCalendar = () => navigate('/Calendar');
  const routeToTask = () => navigate('/Task');
  const routeToNotes = () => navigate('/Notes');
  const routeGPT = () => {
    navigate('/AIScheduler');
  };

  const isActiveRoute = (path) => location.pathname === path;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const playSound = () => {
    const audio = new Audio('/alert.mp3');
    audio.play().catch(err => {
      console.error("Failed to play sound:", err);
    });
  };

  const showAlert = (message) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'timer-alert';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
      alertBox.classList.add('fade-out');
      setTimeout(() => {
        alertBox.remove();
      }, 500); 
    }, 5000);
  };

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            clearInterval(id);
            setIsActive(false);
            setIsBreak(prev => !prev);
            playSound();
            showAlert(isBreak ? 'Break time over! Back to work!' : 'Work time over! Take a break!');
            return isBreak ? 25 * 60 : 5 * 60; 
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
      localStorage.setItem('intervalId', id);
    }
  };

  const stopTimer = () => {
    if (isActive) {
      clearInterval(intervalId);
      setIsActive(false);
      localStorage.removeItem('intervalId');
    }
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIsActive(false);
    setTime(isBreak ? 5 * 60 : 25 * 60); 
    setIsBreak(false);
    localStorage.removeItem('intervalId');
  };

  useEffect(() => {
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('isActive', JSON.stringify(isActive));
    localStorage.setItem('isBreak', JSON.stringify(isBreak));
  }, [time, isActive, isBreak]);

  useEffect(() => {
    const savedIntervalId = localStorage.getItem('intervalId');
    if (savedIntervalId && isActive) {
      startTimer();
    }
    return () => clearInterval(intervalId);
  }, [isActive]);

  return (
    <div className="time-container">
      <header className="time-header">
        <div className="time-logo">Chrono Craft</div>
        <span className="time-username">{loggedInUser}</span>
      </header>
      <div className="time-main">
        <nav className="time-sidebar">
          <button
            className={`time-nav-button ${isActiveRoute('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActiveRoute('/Dashboard') ? nav11 : nav1} alt="Dashboard" className="time-nav-icon" /> Dashboard
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToCalendar}
          >
            <img src={hovered === 'calendar' || isActiveRoute('/Calendar') ? nav22 : nav2} alt="Calendar" className="time-nav-icon" /> Calendar
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTask}
          >
            <img src={hovered === 'task' || isActiveRoute('/Task') ? nav33 : nav3} alt="Tasks" className="time-nav-icon" /> To-Do
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActiveRoute('/Notes') ? nav44 : nav4} alt="Notes" className="time-nav-icon" /> Notes
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/Timer') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('timer')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'timer' || isActiveRoute('/Timer') ? nav55 : nav5} alt="Timer" className="time-nav-icon" /> Pomodoro Timer
          </button>
          <button
            className={`db-nav-button ${isActiveRoute('/AIScheduler') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeGPT}
          >
            <img src={hovered === 'gpt' || isActiveRoute('/AIScheduler') ? nav77 : nav7} alt="AIScheduler" className="db-nav-icon" />AIScheduler
          </button>        
          <button
            className={`time-nav-button ${isActiveRoute('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActiveRoute('/logout') ? nav66 : nav6} alt="Logout" className="time-nav-icon" /> Logout
          </button>
        </nav>
        <div className="time-content">
          <h1>Pomodoro Timer</h1>
          <p>Manage your time effectively with the Pomodoro technique. Focus on your work and take regular breaks.</p>

          <div className="timer-display">
            <span className="timer-time">{formatTime(time)}</span>
            <div className="timer-bar-container">
              <div className="timer-bar" style={{ width: `${(time / (isBreak ? 5 * 60 : 25 * 60)) * 100}%` }}></div>
            </div>
          </div>
          <div className="timer-controls">
            <button onClick={startTimer} disabled={isActive} className="timer-button">Start</button>
            <button onClick={stopTimer} disabled={!isActive} className="timer-button">Stop</button>
            <button onClick={resetTimer} className="timer-button">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
