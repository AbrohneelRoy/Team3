import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './Calendar.css';

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

const Calendar = () => {
  const [hovered, setHovered] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 

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

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);

  useEffect(() => {
    if (userId !== null) {
      axios.get(`http://localhost:8080/api/events/${userId}`)
        .then(response => setEvents(response.data))
        .catch(error => console.error("Error fetching events:", error));
    }
  }, [userId, loggedInUser]);


useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const upcomingEvents = events.filter(event => {
      const startTime = new Date(event.start);
      const timeDifference = startTime - now;
      return timeDifference > 0 && timeDifference <= 600000; 
    });

    upcomingEvents.forEach(event => {
      sendEmailAlert(event);
    });
  }, 60000); 

  return () => clearInterval(interval);
}, [events]);

const sendEmailAlert = (event) => {
  if (!email) {
    console.error("Email is not defined");
    return;
  }

  const templateParams = {
    to_email: email,
    event_title: event.title,
    event_start: new Date(event.start).toLocaleString(),
    event_description: event.description || 'No description provided',
  };

  console.log("Sending email with parameters:", templateParams);

  emailjs.send('service_grrc09p', 'template_fz3jxvw', templateParams, '9qPVcliB0l4Hvmnc3')
    .then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    })
    .catch((error) => {
      console.error('Failed to send email:', error);
    });
};


  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/Login', { replace: true });
  };

  const routeToDashboard = () => {
    navigate('/Dashboard');
  };

  const routeToTask = () => {
    navigate('/Task');
  };

  const routeGPT = () => {
    navigate('/AIScheduler');
  };

  const routeToNotes = () => {
    navigate('/Notes');
  };

  const routeTime = () => {
    navigate('/Timer');
  };

  const routeHab = () => {
    navigate('/Habit');
  };

  const isActive = (path) => location.pathname === path;

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setNewEvent({
      title: event.title || '',
      start: event.startStr || '',
      end: event.endStr || '', 
      description: event.extendedProps.description || '' 
    });
    setIsEdit(true);
    setCurrentEventId(event.id); 
    setIsModalOpen(true);
  };

  const handleSelect = (selectInfo) => {
    const selectedStartDate = new Date(selectInfo.startStr);
    const selectedEndDate = new Date(selectedStartDate);
    selectedEndDate.setHours(selectedEndDate.getHours() + 1); 

    const formatDate = (date) => date.toISOString().slice(0, 16); 

    setNewEvent({
      title: '',
      start: formatDate(selectedStartDate),
      end: formatDate(selectedEndDate),
      description: ''
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewEvent({ title: '', start: '', end: '', description: '' });
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const url = isEdit 
        ? `http://localhost:8080/api/events/${currentEventId}` 
        : 'http://localhost:8080/api/events';
      const method = isEdit ? 'put' : 'post';
      
      axios({
        method: method,
        url: url,
        data: { ...newEvent, userId }
      })
      .then(response => {
        // Reload the page to refresh events
        window.location.reload();
      })
      .catch(error => console.error("Error saving event:", error));
    } else {
      console.error("Please fill all required fields");
    }
  };

  const handleDeleteEvent = () => {
    if (currentEventId) {
      axios.delete(`http://localhost:8080/api/events/${currentEventId}`)
        .then(() => {
          // Reload the page to refresh events
          window.location.reload();
        })
        .catch(error => console.error("Error deleting event:", error));
    } else {
      console.error("No event ID specified for deletion.");
    }
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

  const handleCancel2 = () => {
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
    <div className="calendar-container">
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
              <button onClick={handleCancel2} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="calendar-main">
        <nav className="calendar-sidebar">
          <button
            className={`calendar-nav-button ${isActive('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActive('/Dashboard') ? nav11 : nav1} alt="Home" className="calendar-nav-icon" />Dashboard
          </button>
          <button
            className={`calendar-nav-button ${isActive('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'calendar' || isActive('/Calendar') ? nav22 : nav2} alt="Calendar" className="calendar-nav-icon" />Calendar
          </button>

          <button
            className={`calendar-nav-button ${isActive('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('Task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTask}
          >
            <img src={hovered === 'Task' || isActive('/Task') ? nav33 : nav3} alt="Tasks" className="calendar-nav-icon" />To-Do
          </button>
          <button
            className={`calendar-nav-button ${isActive('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActive('/Notes') ? nav44 : nav4} alt="Notes" className="calendar-nav-icon" />Notes
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
        <div className="calendar-content">
          <h1>Calendar View</h1>
          <div className="calendar-view-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                start: "today prev,next",
                center: "title",
                end: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              height="80vh"
              events={events}
              eventClick={handleEventClick}
              selectable={true}
              select={handleSelect}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <h2>{isEdit ? 'Edit Event' : 'Add New Event'}</h2>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleInputChange}
            />
            <input
              type="datetime-local"
              name="start"
              placeholder="Start Date"
              value={newEvent.start}
              onChange={handleInputChange}
            />
            <input
              type="datetime-local"
              name="end"
              placeholder="End Date"
              value={newEvent.end}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newEvent.description}
              onChange={handleInputChange}
            />
            <div className="calendar-modal-buttons">
              <button onClick={handleSaveEvent}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
              {isEdit && <button onClick={handleDeleteEvent}>Delete</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
