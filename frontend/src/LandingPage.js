import React from 'react';
import './lpstyle.css';
import lpimg from './file.png'; 
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogIn = () => {
    navigate('/login');
  };

  const scrollByPixels = (pixels) => {
    window.scrollBy({ top: pixels, behavior: 'smooth' });
  };

  return (
    <div className="lp-container">
      <header className="lp-header">
        <div className="lp-logo">ChronoCraft</div>
        <nav className="lp-navigation">
          <button onClick={() => scrollByPixels(420)} className="nav-link">About</button>
          <button onClick={() => scrollByPixels(780)} className="nav-link">Service</button>
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
      <section className="lp-about" id="about">
        <h2>About Us</h2>
        <p>Chrono Craft is your ultimate productivity tool, integrating a calendar app, to-do list, notes, AI scheduler, and a Pomodoro timer to help you manage your time effectively. Our platform is designed to streamline your daily tasks and enhance your productivity, making it easier for you to stay organized and focused on your goals.</p>
        <p>Our mission is to provide a comprehensive suite of productivity tools that cater to both individual and team needs. Whether you're managing personal projects or collaborating with a team, Chrono Craft offers a seamless experience that helps you prioritize tasks, manage your schedule, and boost your efficiency. Our user-friendly interface and intelligent features ensure that you can achieve more with less effort.</p>
        <p>At Chrono Craft, we are committed to continuous improvement and innovation. We understand the challenges of modern work environments and strive to create solutions that adapt to your evolving needs. Join us on a journey towards better time management and productivity, and discover how Chrono Craft can transform the way you work and achieve your objectives.</p>
      </section>
      <section className="lp-service" id="service">
        <h2>Our Services</h2>
        <p>At Chrono Craft, we offer a suite of productivity tools designed to enhance your efficiency and help you achieve your goals. Our services include:</p>
        <ul>
          <li><strong>Calendar App:</strong> Organize your schedule with ease.</li>
          <li><strong>To-Do List:</strong> Keep track of your tasks and deadlines.</li>
          <li><strong>Notes:</strong> Jot down ideas and important information.</li>
          <li><strong>AI Scheduler:</strong> Get intelligent scheduling suggestions.</li>
          <li><strong>Pomodoro Timer:</strong> Boost your focus with the Pomodoro technique.</li>
        </ul>
      </section>
      <section className="lp-faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <p>Here are some common questions about Chrono Craft:</p>
        <ul>
          <li><strong>What is Chrono Craft?</strong> Chrono Craft is an integrated productivity application that combines multiple tools to help you manage your time and tasks efficiently.</li>
          <li><strong>How can I get started?</strong> Simply register for an account and start using our tools immediately.</li>
          <li><strong>Is Chrono Craft free to use?</strong> Yes, Chrono Craft offers a free plan with essential features.</li>
          <li><strong>Can I track my progress?</strong> Yes, Chrono Craft provides detailed analytics and reports to help you track your productivity.</li>
          <li><strong>Can I customize my dashboard?</strong> Yes, Chrono Craft allows you to customize your dashboard to suit your needs.</li>
        </ul>
      </section>
      <footer className="lp-footer" id="contact-us">
        <h2>Contact Us</h2>
        <p>If you have any questions or need assistance, please reach out to us:</p>
        <p>Email: chronocraft@gmail.com</p>
        <p>Phone: +91 9890776681</p>
        <p>Address: Coimbatore, Tamilnadu, India</p>
      </footer>
    </div>
  );
};

export default LandingPage;
