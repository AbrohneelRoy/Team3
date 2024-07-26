import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthGuard from './AuthGuard';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import LandingPage from './LandingPage';
import Task from './Task';
import Calendar from './Calendar';
import Notes from './Notes';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
        <Route
          path="/Dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/Task"
          element={
            <AuthGuard>
              <Task />
            </AuthGuard>
          }
        />
        <Route
          path="/Calendar"
          element={
            <AuthGuard>
              <Calendar />
            </AuthGuard>
          }
        />
        <Route
          path="/Notes"
          element={
            <AuthGuard>
              <Notes />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
