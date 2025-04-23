import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false); // ⬅️ NEW
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password, rememberMe); // ⬅️ PASS rememberMe
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-sm border-0 p-4 rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
            <i className="bi bi-shield-lock-fill text-primary fs-4"></i>
          </div>
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Sign in to access your account</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
              />
              <label className="form-check-label" htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none text-primary small">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">Or continue with</small>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-outline-secondary rounded-circle">
              <i className="bi bi-github"></i>
            </button>
            <button className="btn btn-outline-primary rounded-circle">
              <i className="bi bi-twitter"></i>
            </button>
          </div>
        </div>

        <div className="text-center mt-4 border-top pt-3">
          <small>
            Don’t have an account?{' '}
            <Link to="/signup" className="text-primary text-decoration-none fw-semibold">Sign up</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
