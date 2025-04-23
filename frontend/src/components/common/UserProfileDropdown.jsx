import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import defaultAvatar from '../../assets/images/default_profile.jpg';

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  
  // Use full avatar URL if available
  const avatarUrl = user?.profile?.avatar
  ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${user.profile.avatar}`
  : defaultAvatar;
  
  console.log("📸 Avatar URL:", avatarUrl);

  const displayName = user?.name || 'User';

  const toggleDropdown = () => setOpen(prev => !prev);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Auto-close dropdown on outside click
  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (!e.target.closest('#userDropdown')) {
        setOpen(false);
      }
    };

    document.addEventListener('click', closeOnClickOutside);
    return () => document.removeEventListener('click', closeOnClickOutside);
  }, []);

  return (
    <div className="dropdown">
      <button
        className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded={open}
        onClick={toggleDropdown}
      >
        <img
        src={avatarUrl}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
        className="rounded-circle"
        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
        />
        <span className="d-none d-md-inline small fw-medium">{displayName}</span>
      </button>

      <ul
        className={`dropdown-menu dropdown-menu-end shadow ${open ? 'show' : ''}`}
        aria-labelledby="userDropdown"
      >
        <li>
          <button
            className="dropdown-item"
            onClick={() => {
              setOpen(false);
              navigate('/profile');
            }}
          >
            Update Profile
          </button>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfileDropdown;
