import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './AIScheduler.css';
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
import micIcon from './mic.png';
import micHover from './michover.png';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const currentDate = new Date();
const currentDateString = currentDate.toISOString().split('T')[0];

const predefinedInstruction = `
  Please provide the following event details in JSON format: title, start time, end time, and description.
  Today’s date is ${currentDateString}.
  I want appropriate Title good Grammer try to limit words but don't change or make difficult meaning.
  if time not mentioned then set the time as per the universal standards.
  In description for 5 words put something as per the title.
  just give me only in JSON format alone such that i can post in backend, if extra words you give then error, so strictly follow json what ever condition maybe please.
  Example format: [
    {
      "title": "Event Title",
      "start": "2024-07-26T00:00",
      "end": "2024-07-26T01:00",
      "description": "Event Description"
    }
  ]
`;

const AIScheduler = () => {
  const [hovered, setHovered] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponseText] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false); // New state for showing the Confirm button
  const [showTable, setShowTable] = useState(false); // New state for showing/hiding the table
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false); 


  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');
  const [userId, setUserId] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setPrompt(transcript);
  }, [transcript]);

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
    fetch(`http://localhost:8080/login/${userId}`)
      .then(response => response.json())
      .then(data => {
        setUserDetails(data);
        setEditedDetails({ username: data.username, email: data.email, password: '' });
      });
  }, [userId]);

  useEffect(() => {
    fetchUserInfo();
  }, [loggedInUser]);



  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login', { replace: true });
  };


  const parseResponseToEvents = (responseText) => {
    try {
      // Log the raw response text for debugging
      console.log('Raw response text:', responseText);
  
      // Clean the response text to remove unwanted characters
      const cleanedText = responseText
        .replace(/```json/g, '') // Remove starting ```json
        .replace(/```/g, '')    // Remove remaining ```
        .trim();                // Remove extra spaces
  
      // Log cleaned response text for debugging
      console.log('Cleaned response text:', cleanedText);
  
      // Attempt to parse the cleaned response text as JSON
      let events = JSON.parse(cleanedText);
  
      // Validate and transform the parsed data into the required format
      if (Array.isArray(events)) {
        return events.map(event => ({
          userId: userId,
          title: event.title ? event.title.trim() : 'Untitled',
          start: event.start ? event.start.trim() : new Date().toISOString(),
          end: event.end ? event.end.trim() : new Date(new Date().getTime() + 3600000).toISOString(), // Default to 1 hour later
          description: event.description ? event.description.trim() : 'No description'
        }));
      } else {
        throw new Error('Parsed data is not an array.');
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      alert('Failed to parse AI response. Please ensure the format is correct.');
      return [];
    }
  };
  
  const isActive = (path) => location.pathname === path;

  const handleGenerate = async () => {
    try {
      const fullPrompt = predefinedInstruction + '\n' + prompt;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAnf3s4y1b_IfSs0WEoUZPGw5FRQm5OI5M', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ]
        }),
      });

      const data = await response.json();
      console.log('Full API response:', data);

      if (response.ok) {
        if (data.candidates && data.candidates.length > 0) {
          const responseText = data.candidates[0].content.parts.map(part => part.text).join(' ');
          console.log('Raw response text:', responseText);

          const events = parseResponseToEvents(responseText);
          setResponseText(events);

          if (events.length > 0) {
            setShowTable(true); 
            setShowConfirmButton(true); 
          } else {
            alert('No valid events to add.');
          }
        } else {
          alert('No valid response received from the AI.');
        }
      } else {
        alert('Error: ' + (data.message || 'Unknown error occurred'));
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('API call failed: Network error or server not responding.');
    }
  };

  const handleConfirm = async () => {
    try {
      const calendarResponse = await fetch('http://localhost:8080/api/events/multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      });

      if (calendarResponse.ok) {
        alert('Events added to calendar successfully.');
        setShowConfirmButton(false); // Hide the Confirm button after successful storage
        setShowTable(false); // Hide the table after successful storage
        setResponseText([]); // Clear the table after successful storage
      } else {
        alert('Failed to add events to calendar.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('API call failed: Network error or server not responding.');
    }
  };

  const handleCancel = () => {
    setShowTable(false); // Hide the table
    setShowConfirmButton(false); // Hide the Confirm button
    setResponseText([]);
  };

  const displayEventsAsTable = (events) => {

    const handleRowClick = (index) => {
      setEditingRowIndex(index);
      setEditedEvent({ ...events[index] });
    };
  
    const handleInputChange = (e, field) => {
      setEditedEvent({ ...editedEvent, [field]: e.target.value });
    };
  
    const handleSave = () => {
      events[editingRowIndex] = editedEvent;
      setEditingRowIndex(null);
    };
  
    const handleCancel = () => {
      setEditingRowIndex(null);
    };






    return (
      <table className="ai-events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              {editingRowIndex === index ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editedEvent.title}
                      className='ai-texttable'
                      onChange={(e) => handleInputChange(e, 'title')}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedEvent.start}
                      className='ai-texttable'
                      onChange={(e) => handleInputChange(e, 'start')}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedEvent.end}
                      className='ai-texttable'
                      onChange={(e) => handleInputChange(e, 'end')}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editedEvent.description}
                      className='ai-texttable'
                      onChange={(e) => handleInputChange(e, 'description')}
                    />
                  </td>
                  <td>
                    <button onClick={handleSave} className='ai-table-save'>Save</button>
                    <button onClick={handleCancel} className='ai-table-cancel'>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td onClick={() => handleRowClick(index)}>{event.title}</td>
                  <td onClick={() => handleRowClick(index)}>{event.start}</td>
                  <td onClick={() => handleRowClick(index)}>{event.end}</td>
                  <td onClick={() => handleRowClick(index)}>{event.description}</td>
                  <td>
                    <button className='ai-table-edit' onClick={() => handleRowClick(index)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const routeToDashboard = () => navigate('/Dashboard');
  const routeToCalendar = () => navigate('/Calendar');
  const routeToTask = () => navigate('/Task');
  const routeToNotes = () => navigate('/Notes');
  const routeToTimer = () => navigate('/Timer');
  const routeHab = () => {
    navigate('/Habit');
  };

  const isActiveRoute = (path) => location.pathname === path;

  


  const handleEditChange = (e, field) => {
    setEditedDetails({ ...editedDetails, [field]: e.target.value });
  };

  const handleSave2 = () => {
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
    <div className="ai-container">
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
                <button onClick={handleSave2} className="save-btn">Save</button>
              )}
              <button onClick={handleCancel2} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="ai-main">
        <nav className="ai-sidebar">
          <button
            className={`ai-nav-button ${isActiveRoute('/Dashboard') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('home')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToDashboard}
          >
            <img src={hovered === 'home' || isActiveRoute('/Dashboard') ? nav11 : nav1} alt="Dashboard" className="ai-nav-icon" /> Dashboard
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Calendar') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('calendar')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToCalendar}
          >
            <img src={hovered === 'calendar' || isActiveRoute('/Calendar') ? nav22 : nav2} alt="Calendar" className="ai-nav-icon" /> Calendar
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Task') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('task')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTask}
          >
            <img src={hovered === 'task' || isActiveRoute('/Task') ? nav33 : nav3} alt="Tasks" className="ai-nav-icon" /> To-Do
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Notes') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('note')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToNotes}
          >
            <img src={hovered === 'note' || isActiveRoute('/Notes') ? nav44 : nav4} alt="Notes" className="ai-nav-icon" /> Notes
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/Timer') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('timer')}
            onMouseLeave={() => setHovered(null)}
            onClick={routeToTimer}
          >
            <img src={hovered === 'timer' || isActiveRoute('/Timer') ? nav55 : nav5} alt="Timer" className="ai-nav-icon" /> Pomodoro
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/AIScheduler') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'gpt' || isActiveRoute('/AIScheduler') ? nav77 : nav7} alt="AIScheduler" className="time-nav-icon" /> AIScheduler
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
        <div className="ai-content">
          <h1>AI Scheduler</h1>
          <p>Manage your schedule with the AI Scheduler. Optimize your time with smart suggestions.</p>
          <div className="ai-prompt-container">
            <textarea
              className="ai-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
            />
            <button
              className="ai-mic-button"
              onClick={handleMicClick}
              onMouseEnter={() => setHovered('mic')}
              onMouseLeave={() => setHovered(null)}
            >
              <img src={hovered === 'mic' || listening ? micHover : micIcon} alt="Mic" className="ai-mic-icon" />
            </button>
          </div>
          <button className="ai-generate-button" onClick={handleGenerate}>Generate</button>
          {response.length > 0 && displayEventsAsTable(response)}

          {showConfirmButton && (
            <div>
            <button className="ai-confirm-button" onClick={handleConfirm}>Confirm</button>
            <button className="ai-cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScheduler;
