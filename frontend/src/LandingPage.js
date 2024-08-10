import React, { useEffect, useState } from 'react';
import './lpstyle.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import lpimg from './file.png';
import { useNavigate } from 'react-router-dom';
import ser1 from './calendar.png';
import ser11 from './calendarhover.png';
import ser2 from './task.png';
import ser22 from './taskhoover.png';
import ser3 from './note.png';
import ser33 from './notehover.png';
import ser4 from './timer.png';
import ser44 from './timerhover.png';
import ser5 from './gpt.png';
import ser55 from './gpthover.png';
import { Instagram, Facebook, Twitter } from 'lucide-react';


const LandingPage = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 120,
      easing: 'ease-in-out',
      once: false,
    });
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const scrollByPixels = (pixels) => {
    window.scrollBy({ top: pixels, behavior: 'smooth' });
  };

  const getIconSrc = (icon, hoverSrc, defaultSrc) => {
    return hovered === icon ? hoverSrc : defaultSrc;
  };

  return (
    <div className="lp-background">
      <div className="lp-container">
        <header className="lp-header">
          <div className="lp-logo">ChronoCraft</div>
          <nav className="lp-navigation">
            <button onClick={() => scrollByPixels(420)} className="nav-link">Service</button>
            <button onClick={() => scrollByPixels(780)} className="nav-link">About</button>
            <button onClick={() => scrollByPixels(1120)} className="nav-link">FAQ</button>
            <button onClick={() => scrollByPixels(1500)} className="nav-link">Contact Us</button>
          </nav>
          <button onClick={handleGetStarted} className="lp-get-started-btn">GET STARTED</button>
        </header>
        <main className="lp-main-content">
          <div className="lp-text-content">
            <h1>Welcome to Chrono Craft</h1>
            <p>Your all-in-one productivity application. Please login or register to continue.</p>
            <button onClick={handleLogIn} className="lp-get-started-btn2">Log In</button>
          </div>
          <img src={lpimg} alt="Landing Page" className="lp-image" />
        </main>
        </div>

        <section className="lp-service" id="service">
      <h2 data-aos="fade-up" data-aos-delay="200">Our Services</h2>
      <div className="lp-services-container">
        <div 
          className="lp-service-box" 
          data-aos="fade-up" 
          data-aos-delay="300"
          onMouseEnter={() => setHovered('ser1')}
          onMouseLeave={() => setHovered(null)}
        >
          <img 
            src={getIconSrc('ser1', ser11, ser1)} 
            alt="Calendar App" 
            className="service-icon"
          />
          <div className="service-name">Calendar App</div>
          <div className="service-content">
            <strong>Organize your schedule with ease.</strong><br />
            Plan your days and weeks efficiently with intuitive calendar features.<br />
            Customize your calendar views and receive reminders for important events.
          </div>
        </div>
        <div 
          className="lp-service-box" 
          data-aos="fade-up" 
          data-aos-delay="400"
          onMouseEnter={() => setHovered('ser2')}
          onMouseLeave={() => setHovered(null)}
        >
          <img 
            src={getIconSrc('ser2', ser22, ser2)} 
            alt="To-Do List" 
            className="service-icon"
          />
          <div className="service-name">To-Do List</div>
          <div className="service-content">
            <strong>Keep track of your tasks and deadlines.</strong><br />
            Prioritize and manage tasks effortlessly.<br />
            Track progress and set reminders to stay on top of your responsibilities.
          </div>
        </div>
        <div 
          className="lp-service-box" 
          data-aos="fade-up" 
          data-aos-delay="200"
          onMouseEnter={() => setHovered('ser3')}
          onMouseLeave={() => setHovered(null)}
        >
          <img 
            src={getIconSrc('ser3', ser33, ser3)} 
            alt="Notes" 
            className="service-icon"
          />
          <div className="service-name">Notes</div>
          <div className="service-content">
            <strong>Jot down ideas and important information.</strong><br />
            Organize notes with tags and categories.<br />
            Sync notes across devices for seamless access anywhere.
          </div>
        </div>
        <div 
          className="lp-service-box" 
          data-aos="fade-up" 
          data-aos-delay="300"
          onMouseEnter={() => setHovered('ser4')}
          onMouseLeave={() => setHovered(null)}
        >
          <img 
            src={getIconSrc('ser4', ser44, ser4)} 
            alt="Pomodoro Timer" 
            className="service-icon"
          />
          <div className="service-name">Pomodoro Timer</div>
          <div className="service-content">
            <strong>Boost your focus with the Pomodoro technique.</strong><br />
            Work in focused intervals with breaks in between.<br />
            Track your productivity and adjust intervals as needed.
          </div>
        </div>
        <div 
          className="lp-service-box" 
          data-aos="fade-up" 
          data-aos-delay="400"
          onMouseEnter={() => setHovered('ser5')}
          onMouseLeave={() => setHovered(null)}
        >
          <img 
            src={getIconSrc('ser5', ser55, ser5)} 
            alt="AI Scheduler" 
            className="service-icon"
          />
          <div className="service-name">AI Scheduler</div>
          <div className="service-content">
            <strong>Get intelligent scheduling suggestions.</strong><br />
            Optimize your time management with AI-driven recommendations.<br />
            Adapt schedules based on your preferences and priorities.
          </div>
        </div>
      </div>
    </section>

        <footer className="custom-footer">
  <div className="footer-content">
    <div className="footer-left">
      <div className="footer-about">
        <h2>ChronoCraft</h2>
        <p>Your productivity partner</p>
        <p>We provide tools and resources to help you manage your time effectively.</p>
        <p>Join us to enhance your productivity and achieve your goals.</p>
      </div>
    </div>
    <div className="footer-right">
      <div className="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="#service">Services</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul>
      </div>
      <div className="footer-services">
        <h3>Our Services</h3>
        <ul>
          <li><a href="#calendar">Calendar App</a></li>
          <li><a href="#todo">To-Do List</a></li>
          <li><a href="#notes">Notes</a></li>
          <li><a href="#timer">Pomodoro Timer</a></li>
          <li><a href="#ai-scheduler">AI Scheduler</a></li>
        </ul>
      </div>
      <div className="footer-resources">
        <h3>Resources</h3>
        <ul>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#help">Help Center</a></li>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
        </ul>
      </div>
      <div className="footer-contact">
        <h3>Contact Us</h3>
        <p>Email: chronocraft.web@gmail.com</p>
        <p>Phone: +91 9089786756</p>
      </div>
    </div>
  </div>
  <div className="footer-bottom">
    <div className="footer-social">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <Facebook />
        </a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <Instagram />
        </a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
          <Twitter />
        </a>
      </div>
    </div>
    <p>&copy; {new Date().getFullYear()} ChronoCraft. All rights reserved.</p>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;
