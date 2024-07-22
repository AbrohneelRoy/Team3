import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthGuard from './AuthGuard';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
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
