import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null
      ? saved === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('highContrast', highContrast);
  }, [highContrast]);

  return (
    <div className="d-flex gap-2">
      {/* Dark Mode Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`btn btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center shadow ${
          darkMode ? 'btn-warning text-dark' : 'btn-outline-dark'
        }`}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        title={darkMode ? 'Light Mode' : 'Dark Mode'}
      >
        <i
          className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'} fs-5`}
          style={{ transition: 'transform 0.3s ease' }}
        ></i>
      </button>

      {/* High Contrast Button */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        className={`btn btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center shadow ${
          highContrast ? 'btn-dark text-white' : 'btn-outline-dark'
        }`}
        aria-label={
          highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'
        }
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        title={highContrast ? 'Normal Contrast' : 'High Contrast'}
      >
        <i
          className={`bi ${highContrast ? 'bi-eye-slash' : 'bi-eye'} fs-5`}
          style={{ transition: 'transform 0.3s ease' }}
        ></i>
      </button>
    </div>
  );
};

export default DarkModeToggle;
