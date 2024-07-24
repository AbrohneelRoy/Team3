import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './lpstyle.css'; // Assuming styles are defined in this CSS file
import lpimg from './file.png'; // Assuming the image is in the same directory

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/Register');
  };
  const handleLogIn = () => {
    navigate('/login');
  };

  return (
    <div className="lp-container">
      <header className="lp-header">
        <div className="lp-logo">Chrono Craft</div>
        <nav className="lp-navigation">
          <Link to="/" className="lp-link">Home</Link>
          <Link to="/about" className="lp-link">About</Link>
          <Link to="/service" className="lp-link">Service</Link>
          <Link to="/contact-us" className="lp-link">Contact Us</Link>
          <Link to="/faq" className="lp-link">FAQ</Link>
        </nav>
        <button onClick={handleGetStarted} className="lp-get-started-btn">GET STARTED</button>
      </header>
      <main className="lp-main-content">
        <div className="lp-text-content">
          <h1>Welcome to Our Application</h1>
          <p>Please login or register to continue.</p>
          <button onClick={handleLogIn} className="lp-get-started-btn2">Log In</button>

        </div>
          <img src={lpimg} alt="Landing Page" className="lp-image" />
      </main>
    </div>
  );
};

export default LandingPage;
