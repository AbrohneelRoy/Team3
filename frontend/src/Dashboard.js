import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
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
  const [userId, setUserId] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [importantTasks, setImportantTasks] = useState([]);
  const [email, setEmail] = useState(null);
  const [uniqueContent, setUniqueContent] = useState("This could be a motivational quote or recent achievements");

  const loggedInUser = localStorage.getItem('username');

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
        setEmail(currentUser.email);
      } else {
        console.error('User not found in API response');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchTodaysEvents = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/events/${userId}`);
      const events = response.data;

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Filter events to only include those that are scheduled for today
      const filteredEvents = events.filter(event => event.start.split('T')[0] === today);

      setTodaysEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
    }
  };

  const fetchImportantTasks = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks/important');
      const tasks = response.data;

      // Filter tasks to only include those that belong to the current user
      const userTasks = tasks.filter(task => task.userId === userId);

      setImportantTasks(userTasks);
    } catch (error) {
      console.error('Error fetching important tasks:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);

  useEffect(() => {
    if (userId) {
      fetchTodaysEvents(userId);
      fetchImportantTasks(userId);
    }
  }, [userId]);

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

  const formatEventTime = (start) => {
    const time = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return time !== "Invalid Date" ? time : "Time not specified";
  };

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
          <div className="db-container-box">
            <h2>Today's Events</h2>
            <ul>
              {todaysEvents.length > 0 ? todaysEvents.map(event => (
                <li key={event.id}>{event.title} at {formatEventTime(event.start)}</li>
              )) : <li>No events for today.</li>}
            </ul>
          </div>
          <div className="db-container-box">
            <h2>Important To-Do </h2>
            <ul>
              {importantTasks.length > 0 ? importantTasks.map(task => (
                <li key={task.id}>{task.task}</li>
              )) : <li>No important tasks.</li>}
            </ul>
          </div>
          <div className="db-container-box">
            <h2>Unique Content</h2>
            <p>{uniqueContent}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
