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
import nav5 from './timer.png';
import nav55 from './timerhover.png';
import nav6 from './logout.png';
import nav66 from './logouthover.png';
import nav7 from './gpt.png';
import nav77 from './gpthover.png';
import profile from './profile.png';

const Dashboard = () => {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [role,setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [importantTasks, setImportantTasks] = useState([]);
  const [email, setEmail] = useState(null);
  const [uniqueContent, setUniqueContent] = useState("This could be a motivational quote or recent achievements");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');

  const loggedInUser = localStorage.getItem('username');

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
        setEmail(currentUser.email);
        setRole(currentUser.role);
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

      const today = new Date().toISOString().split('T')[0];

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
  const routeTime = () => {
    navigate('/Timer');
  };
  const routeGPT = () => {
    navigate('/AIScheduler');
  };


  const isActive = (path) => location.pathname === path;

  const formatEventTime = (start) => {
    const time = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return time !== "Invalid Date" ? time : "Time not specified";
  };

  useEffect(() => {
    // Fetch user data from the API
    axios.get('http://localhost:8080/login')
      .then(response => {
        setUserData(response.data);
      })
      .catch(err => {
        setError('Failed to fetch user data');
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/login/${id}`)
      .then(() => {
        // Refresh the user data after deletion
        setUserData(prevData => prevData.filter(user => user.id !== id));
      })
      .catch(err => {
        setError('Failed to delete user');
      });
  };


  const handleAddUserClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, email: newEmail, password: newPassword, role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        handleClosePopup();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed: Network error or server not responding.');
    }
  };



  return (
    <>
      {role === "user" && (
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
                className={`db-nav-button ${isActive('/Timer') ? 'active' : ''}`}
                onMouseEnter={() => setHovered('time')}
                onMouseLeave={() => setHovered(null)}
                onClick={routeTime}
              >
                <img src={hovered === 'time' || isActive('/Timer') ? nav55 : nav5} alt="Timer" className="db-nav-icon" />Pomodoro Timer
              </button>
              <button
                className={`db-nav-button ${isActive('/AIScheduler') ? 'active' : ''}`}
                onMouseEnter={() => setHovered('gpt')}
                onMouseLeave={() => setHovered(null)}
                onClick={routeGPT}
              >
                <img src={hovered === 'gpt' || isActive('/AIScheduler') ? nav77 : nav7} alt="AIScheduler" className="db-nav-icon" />AIScheduler
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
                <h2>Important To-Do</h2>
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
      )}
      {role === "admin" && (
      <div className="db-container">
      <header className="db-header">
        <div className="db-logo">Chrono Craft</div>
        <span style={{ fontSize: '1.6em', color: '#18bc9c' }}>{loggedInUser}</span>
      </header>
      <div className="db-main">
        <nav className="db-sidebar">
          <button
            className={`db-nav-button active`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'gpt' ? nav7 : profile} alt="Manage Users" className="db-nav-icon" />Manage Users
          </button>
          <button
            className={`db-nav-button ${isActive('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' ? nav66 : nav6} alt="Logout" className="db-nav-icon" />Logout
          </button>
        </nav>
        <div className="db-content">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {userData ? (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Loading user data...</p>
          )}
          <button className="add-user-button" onClick={handleAddUserClick}>+</button>
          {isPopupVisible && (
            <div className="popup-container">
              <div className="popup-content">
                <h2>Add New User</h2>
                <form onSubmit={handleSubmit}>
                  <label>
                    Username:
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
                  </label>
                  <label>
                    Email:
                    <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                  </label>
                  <label>
                    Password:
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </label>
                  <label>
                    Role:
                    <label>
                      <input type="radio" value="user" checked={newRole === 'user'} onChange={() => setNewRole('user')} /> User
                    </label>
                    <label>
                      <input type="radio" value="admin" checked={newRole === 'admin'} onChange={() => setNewRole('admin')} /> Admin
                    </label>
                  </label>
                  <button type="submit" className="extra-user-button">Add User</button>
                  <button type="button" className="cancel-button" onClick={handleClosePopup}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      )}
    </>
  );
  
  
};

export default Dashboard;
