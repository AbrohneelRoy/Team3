import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './Calendar.css';

// Import navigation icons
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

const Calendar = () => {
  const [hovered, setHovered] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null); // Fixed typo here
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');

  // Fetch user info to get userId and email
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:8080/login');
      const currentUser = response.data.find(user => user.username === loggedInUser);

      if (currentUser) {
        setUserId(currentUser.id);
        setEmail(currentUser.email); // Fixed typo here
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

  // Fetch events for the user
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
      return timeDifference > 0 && timeDifference <= 600000; // 10 minutes in milliseconds
    });

    upcomingEvents.forEach(event => {
      sendEmailAlert(event);
    });
  }, 60000); // Check every 1 minute

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

  emailjs.send('service_x09rm1q', 'template_8v5t7ww', templateParams, 'I2_GAwSRfXrh5MpA0')
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

  const routeToNotes = () => {
    navigate('/Notes');
  };

  const isActive = (path) => location.pathname === path;

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setNewEvent({
      title: event.title || '',
      start: event.startStr || '', // Using startStr for correct format
      end: event.endStr || '', // Using endStr for correct format
      description: event.extendedProps.description || '' // Extended properties if any
    });
    setIsEdit(true);
    setCurrentEventId(event.id); // Use the event ID provided directly by clickInfo
    setIsModalOpen(true);
  };

  const handleSelect = (selectInfo) => {
    const selectedStartDate = new Date(selectInfo.startStr);
    const selectedEndDate = new Date(selectedStartDate);
    selectedEndDate.setHours(selectedEndDate.getHours() + 1); // Set end time to one hour later

    const formatDate = (date) => date.toISOString().slice(0, 16); // Format date to YYYY-MM-DDTHH:MM

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

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="calendar-logo">Chrono Craft</div>
        <span style={{ fontSize: '1.6em', color: '#18bc9c' }}>{loggedInUser}</span>
      </header>
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
            className={`calendar-nav-button ${isActive('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActive('/logout') ? nav66 : nav6} alt="Logout" className="calendar-nav-icon" />Logout
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
