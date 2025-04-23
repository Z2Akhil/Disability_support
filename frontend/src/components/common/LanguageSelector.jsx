import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setCurrentLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown position-relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
        aria-expanded={isOpen}
      >
        <span className="text-uppercase fw-semibold">{currentLanguage}</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu show dropdown-menu-end shadow-sm rounded-2 mt-2 py-1">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang.code)}
                className={`dropdown-item small ${
                  currentLanguage === lang.code ? 'active fw-medium' : ''
                }`}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
