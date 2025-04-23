import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '',
    dob: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(formData); // send all fields
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow p-4 rounded-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Create Your Account</h2>
              <p className="text-muted">Join our disability support community</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" name="name"
                  value={formData.name} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" name="email"
                  value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" className="form-control" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="dob" className="form-label">Date of Birth</label>
                <input type="date" className="form-control" id="dob" name="dob"
                  value={formData.dob} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select className="form-select" id="gender" name="gender"
                  value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">You are:</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" id="role-user"
                    value="user" checked={formData.role === 'user'} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="role-user">A person with disability</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" id="role-caregiver"
                    value="caregiver" checked={formData.role === 'caregiver'} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="role-caregiver">A caregiver or supporter</label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password"
                  value={formData.password} onChange={handleChange} required minLength={8} />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="confirmPassword" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} required minLength={8} />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating account...
                  </>
                ) : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-4 border-top pt-3">
              <small>
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                  Sign in
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
