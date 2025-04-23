import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "../api"; // ✅ correct path


const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    name: '',
    disabilityType: '',
    accessibilityPreferences: {},
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const disabilityOptions = [
    'physical',
    'visual',
    'hearing',
    'cognitive',
    'learning',
    'mentalHealth',
    'none',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/users/me');

        setFormData({
          name: res.data.name || '',
          disabilityType: res.data.disabilityType || '',
          accessibilityPreferences: res.data.accessibilityPreferences || {},
          avatar: null,
        });

        if (res.data.profile?.avatar) {
          setPreview(`${import.meta.env.VITE_API_BASE_URL}/uploads/${res.data.profile.avatar}`);
        }        
      } catch (err) {
        setError('Failed to load profile. Please try again.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.startsWith('accessibilityPreferences.')) {
      const prefKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        accessibilityPreferences: {
          ...prev.accessibilityPreferences,
          [prefKey]: checked,
        },
      }));
    } else if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('disabilityType', formData.disabilityType);
    data.append(
      'accessibilityPreferences',
      JSON.stringify(formData.accessibilityPreferences)
    );
    if (formData.avatar) {
      data.append('avatar', formData.avatar);
    }

    try {
      await axios.patch('/users/me', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await refreshUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow p-4 rounded-4">
            <h3 className="text-center mb-4">Update Profile</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="disabilityType" className="form-label">Disability Type</label>
                <select
                  className="form-select"
                  id="disabilityType"
                  name="disabilityType"
                  value={formData.disabilityType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Select...</option>
                  {disabilityOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Accessibility Preferences</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pref-largeText"
                    name="accessibilityPreferences.largeText"
                    checked={formData.accessibilityPreferences.largeText || false}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="pref-largeText">
                    Large Text
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pref-screenReader"
                    name="accessibilityPreferences.screenReader"
                    checked={formData.accessibilityPreferences.screenReader || false}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="pref-screenReader">
                    Screen Reader Friendly
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {preview && (
                <div className="mb-3 text-center">
                  <img
                    src={preview}
                    alt="Avatar preview"
                    className="rounded-circle shadow"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
