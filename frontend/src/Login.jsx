import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        // Configure axios globally to use the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#0b0f19', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="col-11 col-md-5 col-lg-4">
        <div className="card p-5 rounded-4 shadow-2xl transition-card" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-white tracking-tight"><span className="text-info">&lt;/&gt;</span> System Auth</h2>
            <p className="text-secondary small">Restricted Administrative Access</p>
          </div>

          {error && <div className="alert alert-danger small p-2 mb-4 text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                className="form-control custom-input-dark text-center"
                placeholder="Enter Master Passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                style={{ letterSpacing: '0.2rem', padding: '12px' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-info text-dark fw-bold w-100 py-2 rounded-3"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <>Unlock System <i className="bi bi-unlock-fill ms-2"></i></>
              )}
            </button>
            <a href="/" className="btn btn-outline-secondary w-100 mt-3 py-2 rounded-3" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
               Return to Public Site
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
