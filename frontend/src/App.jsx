import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './home';
import Admin from './admin';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#0b0f19' }}>
        <div className="spinner-border text-info" role="status"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Core Profile Interface Pathway */}
        <Route path="/" element={<Home />} />
        
        {/* Admin CRUD Dashboard Interface Pathway */}
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Admin onLogout={() => setIsAuthenticated(false)} /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;