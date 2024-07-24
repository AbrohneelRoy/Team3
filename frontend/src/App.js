import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthGuard from './AuthGuard';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import LandingPage from './LandingPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/Register"
          element={
            <AuthGuard>
              <Register />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
