import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import './Notes.css';
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

const Notes = () => {
  const [hovered, setHovered] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 
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

  const fetchNotes = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/notes/${userId}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
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

  const isActive = (path) => location.pathname === path;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote({
      ...newNote,
      [name]: value
    });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.title && newNote.content && userId) {
      try {
        if (editingNote) {
          // Update existing note
          await axios.put(`http://localhost:8080/api/notes/${editingNote.id}`, {
            userId: userId,
            title: newNote.title,
            notes: newNote.content
          });
        } else {
          // Add new note
          await axios.post('http://localhost:8080/api/notes', {
            userId,
            title: newNote.title,
            notes: newNote.content
          });
        }
        setNewNote({ title: '', content: '' });
        setShowForm(false);
        setEditingNote(null);
        fetchNotes(userId); // Refresh notes list
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleEditNote = (note) => {
    setNewNote({
      title: note.title,
      content: note.notes 
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      fetchNotes(userId); 
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo().then(() => {
      if (userId) {
        fetchNotes(userId); 
      }
    });
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
          <h1>Notes Management</h1>
          <p>Here you can manage your notes. Use the sidebar to navigate to different sections.</p>
          {showForm && (
            <form onSubmit={handleAddNote} className="note-form">
              <input
                type="text"
                name="title"
                value={newNote.title}
                onChange={handleInputChange}
                placeholder="Note Title"
                className="note-input"
                required
              />
              <textarea
                name="content"
                value={newNote.content}
                onChange={handleInputChange}
                placeholder="Note Content"
                className="note-textarea"
                required
              />
              <button type="submit" className="note-submit">{editingNote ? 'Update Note' : 'Add Note'}</button>
            </form>
          )}
          <div className="note-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                <h2 className="note-title">{note.title}</h2>
                <p className="note-content">{note.notes}</p> {/* Ensure we're displaying the correct key */}
                <button onClick={() => handleEditNote(note)} className="note-edit-button">Edit</button>
                <button onClick={() => handleDeleteNote(note.id)} className="note-delete-button">Delete</button>
              </div>
            ))}
          </div>
          <button className="note-float-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? '-' : '+'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notes;
