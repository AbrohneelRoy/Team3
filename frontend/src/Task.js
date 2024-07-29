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
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`task-list-item ${task.important ? 'important' : ''} ${fadeOutTasks.includes(task.id) ? 'fade-out' : ''}`}
                onClick={(e) => handleTaskClick(e, task.id)}
              >
                <div className="task-checkbox-container">
                  <input
                    type="checkbox"
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
                    <label className="task-important-label">
                      <input
                        type="checkbox"
                        checked={editTaskImportant}
                        onChange={() => setEditTaskImportant(!editTaskImportant)}
                        className="important-checkbox"
                      />
                      Important
                    </label>
                    <button onClick={handleEditTask} className="task-save-button">Save</button>
                    <button onClick={() => setEditTaskId(null)} className="task-cancel-button">Cancel</button>
                  </div>
                ) : (
                  <span className="task-name">
                    {task.task}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
