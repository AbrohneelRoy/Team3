import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

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
  const [time, setTime] = useState(25 * 60); // Default to 25 minutes for Pomodoro
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [task, setTask] = useState('');
  const [selectedCycle, setSelectedCycle] = useState(1); // Set default to 1 cycle
  const [mode, setMode] = useState('Pomodoro');
  const [taskList, setTaskList] = useState([]);
  const [showTaskInput, setShowTaskInput] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 
  const [userId, setUserId] = useState(null);

  const loggedInUser = localStorage.getItem('username');

  const isActiveRoute = (path) => location.pathname === path;

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
      } else {
        console.error('User not found in API response');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login', { replace: true });
  };

  const routeToDashboard = () => navigate('/Dashboard');
  const routeToCalendar = () => navigate('/Calendar');
  const routeToTask = () => navigate('/Task');
  const routeToNotes = () => navigate('/Notes');
  const routeGPT = () => navigate('/AIScheduler');
  const routeHab = () => {
    navigate('/Habit');
  };



  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const notifyUser = (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    } else {
      alert(message);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    if (time === 0) {
      if (!isBreak) {
        notifyUser('Work session is over! Time for a break.');
        setIsBreak(true);
        setTime(5 * 60); // 5 minute break
        incrementTaskCycles(); // Increment task cycles when timer ends
      } else {
        notifyUser('Break time is over! Back to work.');
        setIsBreak(false);
        setTime(25 * 6); // 25 minute work session
      }
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak]);

  useEffect(() => {
    localStorage.setItem('time', JSON.stringify(time));
    localStorage.setItem('isActive', JSON.stringify(isActive));
    localStorage.setItem('isBreak', JSON.stringify(isBreak));
  }, [time, isActive, isBreak]);

  useEffect(() => {
    const storedTime = JSON.parse(localStorage.getItem('time')) || 25 * 60;
    const storedIsActive = JSON.parse(localStorage.getItem('isActive')) || false;
    const storedIsBreak = JSON.parse(localStorage.getItem('isBreak')) || false;

    setTime(storedTime);
    setIsActive(storedIsActive);
    setIsBreak(storedIsBreak);
  }, []);

  const startTimer = () => {
    if (taskList.length === 0) {
      alert('Please add a task first!');
      return;
    }
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTime(mode === 'Pomodoro' ? 25 * 60 : 5 * 60); // Adjust time based on mode
  };

  const switchMode = (mode) => {
    setMode(mode);
    if (mode === 'Pomodoro') {
      setTime(25 * 60);
    } else if (mode === 'Short Break') {
      setTime(5 * 60);
    } else if (mode === 'Long Break') {
      setTime(15 * 60); // 15 minutes for Long Break
    }
    setIsActive(false);
    setIsBreak(false);
  };



  const addTask = (task, cycle) => {
    if (taskList.length > 0) {
      alert('You can only work on one task at a time. Please complete the current task first.');
      return;
    }
    setTaskList([{ name: task, cycle, completed: 0 }]);
    setTask('');
    setSelectedCycle(1); // Reset to 1 cycle after adding a task
    setShowTaskInput(false); // Hide the input fields after adding the task
  };
  
  const handleTaskCompletion = (index) => {
    // Remove the task and show the input fields again
    setTaskList((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1); // Remove the task from the array
      
      setShowTaskInput(true); // Show the input fields again after task completion
      return updatedTasks;
    });
  };
  
  

  const incrementTaskCycles = () => {
    setTaskList((prevTasks) =>
      prevTasks.map((taskItem) => ({
        ...taskItem,
        completed: taskItem.completed + 1,
      }))
    );
  };

  useEffect(() => {
    fetch(`http://localhost:8080/login/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        setEditedDetails({ username: data.username, email: data.email, password: '' });
      });
  }, [userId]);

  const handleEditChange = (e, field) => {
    setEditedDetails({ ...editedDetails, [field]: e.target.value });
  };

  const handleSave = () => {
    // Update user details
    fetch(`http://localhost:8080/login/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editedDetails, role: 'user' }),
    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        setShowPopup(false); // Close popup after saving
        localStorage.setItem('username', editedDetails.username);
      });
  };

  const handleCancel = () => {
    setEditedDetails({ username: userDetails.username, email: userDetails.email, password: '' });
    setShowPopup(false);
    setShowPasswordChange(false);
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(true);
  };

  const handlePasswordSave = () => {
    // Update user details, including the new password
    fetch(`http://localhost:8080/login/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: editedDetails.username, 
        email: editedDetails.email, 
        password: editedDetails.password, 
        role: 'user' 
      }),
    })
      .then(response => response.json())
      .then(data => {
        setUserDetails(data); // Update the user details state with the new data
        setShowPopup(false); // Close the popup
        setShowPasswordChange(false); // Hide the password change input
        localStorage.setItem('username', editedDetails.username);
      });
  };  

const handleProfileClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const handleProfileSelect = () => {
    setShowPopup(true);
    setIsDropdownVisible(false);
  };

  const handleAnalysisSelect = () => {
    setShowAnalysisPopup(true);
    setIsDropdownVisible(false);
  };


  return (
    <div className="time-container">
 <header className="db-header">
      <div className="db-logo">Chrono Craft</div>
      <div className="db-user-section">
        <span className="db-username">{loggedInUser}</span>
        <span
          className="db-user-profile"
          onClick={handleProfileClick}
        >
          {loggedInUser.charAt(0).toUpperCase()}
        </span>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <button onClick={handleProfileSelect} className="dropdown-item">Profile</button>
            <button onClick={handleAnalysisSelect} className="dropdown-item">Analysis</button>
            <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
          </div>
        )}
      </div>
    </header>
      {showPopup && (
        <div className="user-popup">
          <div className="user-popup-content">
            <h3>User Profile</h3>
            <label>
              Username:
              <input
                type="text"
                value={editedDetails.username}
                onChange={(e) => handleEditChange(e, 'username')}
                className="user-popup-input"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editedDetails.email}
                onChange={(e) => handleEditChange(e, 'email')}
                className="user-popup-input"
              />
            </label>

            {!showPasswordChange && (
              <button onClick={handlePasswordChange} className="change-password-btn">
                Change Password
              </button>
            )}

            {showPasswordChange && (
              <label>
                New Password:
                <input
                  type="password"
                  value={editedDetails.password}
                  onChange={(e) => handleEditChange(e, 'password')}
                  className="user-popup-input"
                />
              </label>
            )}

            <div className="user-popup-actions">
              {showPasswordChange ? (
                <button onClick={handlePasswordSave} className="save-btn">Save Password</button>
              ) : (
                <button onClick={handleSave} className="save-btn">Save</button>
              )}
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
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
            <img src={hovered === 'timer' || isActiveRoute('/Timer') ? nav55 : nav5} alt="Timer" className="time-nav-icon" /> Pomodoro
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/AIScheduler') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeGPT}
          >
            <img src={hovered === 'gpt' || isActiveRoute('/AIScheduler') ? nav77 : nav7} alt="AI Scheduler" className="time-nav-icon" /> AIScheduler
          </button>
          <button
                className={`db-nav-button ${isActiveRoute('/Habit') ? 'active' : ''}`}
                onMouseEnter={() => setHovered('habit')}
                onMouseLeave={() => setHovered(null)}
                onClick={routeHab}
              >
                <img src={hovered === 'habit' || isActiveRoute('/Habit') ? nav66 : nav6} alt="Habit" className="db-nav-icon" />Habit
              </button>
        </nav>
        <div className="time-content">
          <div className="time-settings">
            <button onClick={() => switchMode('Pomodoro')} className={`time-mode-button ${mode === 'Pomodoro' ? 'active' : ''}`}>Pomodoro</button>
            <button onClick={() => switchMode('Short Break')} className={`time-mode-button ${mode === 'Short Break' ? 'active' : ''}`}>Short Break</button>
            <button onClick={() => switchMode('Long Break')} className={`time-mode-button ${mode === 'Long Break' ? 'active' : ''}`}>Long Break</button>
          </div>
          <div className="time-display">
            <div className="time-counter">
              <h1>{formatTime(time)}</h1>
              <p>{isBreak ? 'Break Time!' : 'Work Time!'}</p>
            </div>
            <div className="time-bar">
            <div
              className="time-bar-progress"
              style={{
                width: `${
                  (time / (
                    mode === 'Pomodoro'
                      ? 25 * 60
                      : mode === 'Short Break'
                      ? 5 * 60
                      : 15 * 60
                  )) * 100
                }%`
              }}
            />
          </div>

            
            <div className="time-actions">
              {!isActive ? (
                <button onClick={startTimer} className="time-action-button">Start</button>
              ) : (
                <button onClick={stopTimer} className="time-action-button">Stop</button>
              )}
              <button onClick={resetTimer} className="time-action-button">Reset</button>
            </div>
          </div>
          {showTaskInput ? (
        <div className="time-task-container">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task"
            className="time-task-input"
          />
          <input
            type="number"
            min="1"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(Number(e.target.value))}
            placeholder="Cycles"
            className="time-cycle-input"
          />
          <button onClick={() => addTask(task, selectedCycle)} className="time-add-task-button">
            Add Task
          </button>
        </div>
      ) : (
        taskList.length > 0 && (
          <div className="time-task-list">
            <h2>Current Task</h2>
            {taskList.map((taskItem, index) => (
              <div key={index} className="time-task-item">
                <p>{taskItem.name}</p>
                <p>Cycles Done: {taskItem.completed} / {taskItem.cycle}</p>
                <button onClick={() => handleTaskCompletion(index)} className="time-complete-button">
                  Complete Cycle
                </button>
              </div>
            ))}
          </div>
        )
      )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
