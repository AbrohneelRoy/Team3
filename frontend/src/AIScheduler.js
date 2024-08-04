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
const currentDate = new Date();
const currentDateString = currentDate.toISOString().split('T')[0];

const predefinedInstruction = `
  Please provide the following event details in JSON format: title, start time, end time, and description.
  Today’s date is ${currentDateString}.
  I want appropriate Title good Grammer try to limit words but don't change or make difficult meaning.
  if time not mentioned then set the time as per the universal standards.
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
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem('username');
  const [userId, setUserId] = useState(null);


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

          if (events.length > 0) {
            // Send events data to your calendar API
            const calendarResponse = await fetch('http://localhost:8080/api/events/multiple', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(events),
            });

            if (calendarResponse.ok) {
              alert('Events added to calendar successfully.');
            } else {
              alert('Failed to add events to calendar.');
            }
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

  

  const handleMicClick = () => {
    console.log('Microphone button clicked');
  };

  const routeToDashboard = () => navigate('/Dashboard');
  const routeToCalendar = () => navigate('/Calendar');
  const routeToTask = () => navigate('/Task');
  const routeToNotes = () => navigate('/Notes');
  const routeToTimer = () => navigate('/Timer');

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="ai-container">
      <header className="ai-header">
        <div className="ai-logo">Chrono Craft</div>
        <span className="ai-username">{loggedInUser}</span>
      </header>
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
            <img src={hovered === 'timer' || isActiveRoute('/Timer') ? nav55 : nav5} alt="Timer" className="ai-nav-icon" /> Pomodoro Timer
          </button>
          <button
            className={`time-nav-button ${isActiveRoute('/AIScheduler') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('gpt')}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={hovered === 'gpt' || isActiveRoute('/AIScheduler') ? nav77 : nav7} alt="AIScheduler" className="time-nav-icon" /> AIScheduler
          </button>
          <button
            className={`ai-nav-button ${isActiveRoute('/logout') ? 'active' : ''}`}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            onClick={handleLogout}
          >
            <img src={hovered === 'logout' || isActiveRoute('/logout') ? nav66 : nav6} alt="Logout" className="ai-nav-icon" /> Logout
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
              <img src={hovered === 'mic' ? micHover : micIcon} alt="Mic" />
            </button>
          </div>
          <button className="ai-generate-button" onClick={handleGenerate}>Generate</button>
          {response && (
            <div className="ai-response">
              <h2>AI Response</h2>
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIScheduler;
