import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Task.css';
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
import starFilled from './star.png'; // Make sure to add this image
import starOutline from './star2.png'; // Make sure to add this image

const Task = () => {
  const [hovered, setHovered] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskImportant, setEditTaskImportant] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isImportant, setIsImportant] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [fadeOutTasks, setFadeOutTasks] = useState([]);
  const [isPlusSign, setIsPlusSign] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 

  const [searchQuery, setSearchQuery] = useState('');
  const filteredTasks = tasks.filter(task =>
    task.task.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

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

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '') return;
    const task = { userId, task: newTask, important: isImportant };
    try {
      const response = await axios.post('http://localhost:8080/api/tasks', task);
      setTasks([...tasks, response.data]);
      setNewTask('');
      setIsImportant(false);
      setIsAddingTask(false);
      setIsPlusSign(true); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    if (editTaskText.trim() === '') return;
    const updatedTask = { id: editTaskId, userId, task: editTaskText, important: editTaskImportant };
    try {
      const response = await axios.put(`http://localhost:8080/api/tasks/${editTaskId}`, updatedTask);
      setTasks(tasks.map(task => task.id === editTaskId ? response.data : task));
      setEditTaskId(null);
      setEditTaskText('');
      setEditTaskImportant(false);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setFadeOutTasks([...fadeOutTasks, taskId]);
    setTimeout(async () => {
      try {
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
        setTasks(tasks.filter(task => task.id !== taskId));
        setFadeOutTasks(fadeOutTasks.filter(id => id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }, 3000);
  };

  const handleCompleteTask = (taskId) => {
    handleDeleteTask(taskId);
  };

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

  const routeTime = () => {
    navigate('/Timer');
  };

  const routeToNotes = () => {
    navigate('/Notes');
  };

  const routeGPT = () => {
    navigate('/AIScheduler');
  };

  const routeHab = () => {
    navigate('/Habit');
  };

  const isActive = (path) => location.pathname === path;

  const handleTaskClick = (event, taskId) => {
    if (event.target.tagName === 'INPUT') return;

    if (editTaskId === taskId) {
      setEditTaskId(null);
      setEditTaskText('');
      setEditTaskImportant(false);
    } else {
      setEditTaskId(taskId);
      setEditTaskText(tasks.find(task => task.id === taskId).task);
      setEditTaskImportant(tasks.find(task => task.id === taskId).important);
    }
  };

  const toggleSign = () => {
    setIsPlusSign(prev => !prev);
  
    setIsAddingTask(prev => !prev);
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
    <div className="task-container">
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
            className={`db-nav-button ${isActive('/Timer') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('time')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeTime}
          >
            <img src={hovered === 'time' || isActive('/Timer') ? nav55 : nav5} alt="Timer" className="db-nav-icon" />Pomodoro
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
                className={`db-nav-button ${isActive('/Habit') ? 'active' : ''}`}
                onMouseEnter={() => setHovered('habit')}
                onMouseLeave={() => setHovered(null)}
                onClick={routeHab}
              >
                <img src={hovered === 'habit' || isActive('/Habit') ? nav66 : nav6} alt="Habit" className="db-nav-icon" />Habit
              </button>         
        </nav>
        <div className="task-content">
          <h1>To-Do List</h1>
          <div className="task-search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isAddingTask && (
            <div className="task-input-container">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter new task"
                className="task-input"
              />
              <label className="task-important-label">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={() => setIsImportant(!isImportant)}
                  className="important-checkbox"
                />
                Important
              </label>
              <button onClick={handleAddTask} className="task-add-button">
                <span className="add-icon">+</span> Add Task
              </button>
            </div>
          )}
            <button
              className="floating-add-button"
              onClick={toggleSign}
            >
              <span className="add-icon">{isPlusSign ? '+' : '-'}</span>
            </button>

            <div className="task-list">
  {filteredTasks.map(task => (
    <div
      key={task.id}
      className={`task-list-item ${task.important ? 'important' : ''} ${fadeOutTasks.includes(task.id) ? 'fade-out' : ''}`}
      onClick={(e) => handleTaskClick(e, task.id)}
    >
      <div className="task-checkbox-container">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleCompleteTask(task.id)}
          className="task-checkbox"
        />
      </div>
      {editTaskId === task.id ? (
        <div className="task-edit-container">
          <input
            type="text"
            value={editTaskText}
            onChange={(e) => setEditTaskText(e.target.value)}
            className="task-edit-input"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onClick
              setEditTaskImportant(prev => !prev);
            }}
            className="task-important-button"
          >

          </button>
          <button onClick={handleEditTask} className="task-save-button">Save</button>
          <button onClick={() => setEditTaskId(null)} className="task-cancel-button">Cancel</button>
        </div>
      ) : (
        <span className="task-name">
          {task.task}
        </span>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          // Toggle task importance and update
          const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, important: !t.important } : t
          );
          setTasks(updatedTasks);
          axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
            ...task,
            important: !task.important
          }).catch(error => console.error('Error updating task importance:', error));
        }}
        className="task-important-button"
      >
        <img
          src={task.important ? starOutline : starFilled}
          alt="Important"
          className="star-icon"
        />
      </button>
    </div>
  ))}
</div>


        </div>
      </div>
    </div>
  );
};

export default Task;
