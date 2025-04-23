import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import LanguageSelector from './LanguageSelector';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const { user } = useAuth();

  const services = [
    { name: "Mobility Assistance", path: "/mobility-assistance" },
    { name: "Healthcare Support", path: "/healthcare-support" },
    { name: "Education & Training", path: "/education-training" },
    { name: "Community", path: "/community" },
    { name: "Government Programs", path: "/government-programs" },
    { name: "Caregiver Support", path: "/caregiver-support" },
    { name: "Mental Health", path: "/mental-health" },
    { name: "Legal Rights", path: "/legal-rights" },
    { name: "Emergency Services", path: "/emergency-services" },
  ];

  return (
    <header className="header-custom border-bottom shadow-sm sticky-top z-50">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <Link to="/" className="logo-custom fs-4 fw-bold text-decoration-none">
            DisabilitySupport
          </Link>

          {/* Navigation */}
          <nav className="d-none d-md-flex align-items-center gap-3 nav-links-custom">
            <Link to="/" className="nav-link-custom text-decoration-none">
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </button>
              <ul className="dropdown-menu shadow">
                {services.map(service => (
                  <li key={service.path}>
                    <Link className="dropdown-item small" to={service.path}>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/contact" className="nav-link-custom text-decoration-none">
              Contact
            </Link>
          </nav>

          {/* Right-side Controls */}
          <div className="d-flex align-items-center gap-2">
            <DarkModeToggle />
            <LanguageSelector />

            {user ? (
              <UserProfileDropdown />
            ) : (
              <div className="d-none d-md-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-sm btn-primary text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
