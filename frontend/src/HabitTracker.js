import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import './HabitTracker.css';
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
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitTracker = () => {
  const [hovered, setHovered] = useState(null);
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState('');
  const [completedCounts, setCompletedCounts] = useState({});
  const [stars, setStars] = useState({});

  const [userId, setUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

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

  const routeGPT = () => {
    navigate('/AIScheduler');
  };

  const routeToTask = () => {
    navigate('/Task');
  };

  const routeTime = () => {
    navigate('/Timer');
  };

  const routeHab = () => {
    navigate('/Habit');
  };

  const routeToNotes = () => navigate('/Notes');

  
  const isActive = (path) => location.pathname === path;


  useEffect(() => {
    if (userId) {
      const fetchHabits = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/habits/${userId}`);
          const data = await response.json();
          setHabits(data);

          // Load completedCounts and stars from local storage
          const storedCompletedCounts = JSON.parse(localStorage.getItem(`completedCounts_${userId}`)) || {};
          const storedStars = JSON.parse(localStorage.getItem(`stars_${userId}`)) || {};
          setCompletedCounts(storedCompletedCounts);
          setStars(storedStars);
        } catch (error) {
          console.error('Error fetching habits:', error);
        }
      };

      fetchHabits();
    }
  }, [userId]);

  const addHabit = async () => {
    if (habitName && userId) {
      const newHabit = { userId, name: habitName };
      try {
        const response = await fetch('http://localhost:8080/api/habits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHabit),
        });
        const savedHabit = await response.json();
        setHabits([...habits, savedHabit]);
        setHabitName('');
      } catch (error) {
        console.error('Error adding habit:', error);
      }
    }
  };

  const toggleCompletion = (habit, dayIndex) => {
    const updatedCounts = { ...completedCounts };
    updatedCounts[habit.name] = updatedCounts[habit.name] || Array(7).fill(false);
    updatedCounts[habit.name][dayIndex] = !updatedCounts[habit.name][dayIndex];

    // Check for stars (e.g., every 7 days of progress)
    const completedDays = updatedCounts[habit.name].filter(Boolean).length;
    if (completedDays % 7 === 0 && completedDays > 0) {
      const updatedStars = { ...stars };
      updatedStars[habit.name] = (updatedStars[habit.name] || 0) + 1;
      setStars(updatedStars);

      localStorage.setItem(`stars_${userId}`, JSON.stringify(updatedStars));
    }

    setCompletedCounts(updatedCounts);
    localStorage.setItem(`completedCounts_${userId}`, JSON.stringify(updatedCounts));
  };

  const deleteHabit = async (habit) => {
    try {
      await fetch(`http://localhost:8080/api/habits/${habit.id}`, {
        method: 'DELETE',
      });
      const updatedHabits = habits.filter(h => h.id !== habit.id);
      const { [habit.name]: removedCount, ...updatedCounts } = completedCounts;
      const { [habit.name]: removedStars, ...updatedStars } = stars;

      setHabits(updatedHabits);
      setCompletedCounts(updatedCounts);
      setStars(updatedStars);

      localStorage.setItem(`habits_${userId}`, JSON.stringify(updatedHabits));
      localStorage.setItem(`completedCounts_${userId}`, JSON.stringify(updatedCounts));
      localStorage.setItem(`stars_${userId}`, JSON.stringify(updatedStars));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getCompletionPercentage = (habit) => {
    const completedDays = completedCounts[habit.name]?.filter(Boolean).length || 0;
    return (completedDays / 7) * 100;
  };

  const currentDayIndex = new Date().getDay();

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser, userId]);

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
    <div className="no-container">
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
            <img src={hovered === 'calendar' || isActive('/Calendar') ? nav22 : nav2} alt="Calendar" className="no-nav-icon" /> Calendar
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
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActive('/Notes') ? nav44 : nav4} alt="Notes" className="no-nav-icon" /> Notes
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
        <div className="no-content">
       

        <div className="habit-tracker-content">
            <h1 class="habit-title">Habit Tracker</h1>
            <div class="habit-input-container">
                <input
                    type="text"
                    class="habit-input"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="Enter a new habit"
                />
                <button class="habit-add-button" onClick={addHabit}>Add Habit</button>
            </div>

            <table className="habit-table">
              <thead>
                <tr>
                  <th>Habit</th>
                  {daysOfWeek.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                  <th>Progress</th>
                  <th>Stars</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {habits.map((habit) => (
                  <tr key={habit.id}>
                    <td>{habit.name}</td>
                    {daysOfWeek.map((_, dayIndex) => (
                      <td key={dayIndex}>
                        <input
                          type="checkbox"
                          checked={completedCounts[habit.name]?.[dayIndex] || false}
                          onChange={() => toggleCompletion(habit, dayIndex)}
                          disabled={dayIndex !== currentDayIndex}
                        />
                      </td>
                    ))}
                    <td>
                      <div className="progress-container">
                        <CircularProgressbar
                          value={getCompletionPercentage(habit)}
                          styles={buildStyles({
                            textColor: '#fff',
                            pathColor: '#00adb5',
                            tailColor: 'rgba(255,255,255,.2)',
                          })}
                          strokeWidth={8}
                        />
                      </div>
                    </td>
                    <td>
                      {Array.from({ length: stars[habit.name] || 0 }).map((_, index) => (
                        <span key={index} role="img" aria-label="star">⭐</span>
                      ))}
                    </td>
                    <td>
                      <button onClick={() => deleteHabit(habit)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          
        </div>

      </div>
    </div>
  );
};

export default HabitTracker;
