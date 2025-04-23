import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../../hooks/useAccessibility';

const mockResults = [
  { id: 1, title: "Mobility Assistance Guide", type: "guide", path: "/mobility-assistance#guides" },
  { id: 2, title: "Healthcare Support Services", type: "service", path: "/healthcare-support" },
  { id: 3, title: "Wheelchair Rental Locations", type: "service", path: "/mobility-assistance#rentals" },
  { id: 4, title: "Mental Health Resources", type: "resource", path: "/mental-health" },
  { id: 5, title: "Government Disability Programs", type: "program", path: "/government-programs" }
];

const iconMap = {
  guide: '📖',
  service: '🛠️',
  program: '🏛️',
  resource: '🧠',
  default: '🔍'
};

const SearchBar = ({ variant = 'default' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { voiceMode } = useAccessibility();

  const filteredResults = query.trim()
    ? mockResults.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (highlightIndex !== -1 && filteredResults[highlightIndex]) {
      navigate(filteredResults[highlightIndex].path);
    } else if (filteredResults.length > 0) {
      navigate(filteredResults[0].path);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    setQuery('');
    setIsFocused(false);
    setHighlightIndex(-1);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in your browser.");
      return;
    }

    setShowVoiceModal(true);
    setIsListening(true);

    // Mock recognition delay
    setTimeout(() => {
      const phrases = [
        "Find mobility assistance",
        "Search for healthcare support",
        "Look up wheelchair rentals"
      ];
      const randomQuery = phrases[Math.floor(Math.random() * phrases.length)];
      setQuery(randomQuery);
      setIsListening(false);

      setTimeout(() => setShowVoiceModal(false), 2000);
    }, 3000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setQuery('');
    setIsFocused(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsFocused(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`position-relative ${variant === 'header' ? 'w-100' : 'w-100 mb-3'}`}>
      <form onSubmit={handleSearch} ref={inputRef} className="position-relative">
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightIndex(-1);
            }}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={variant === 'header' ? "Search..." : "Search for services or information..."}
            className="form-control rounded-pill ps-4 pe-5"
            aria-label="Search disability support resources"
          />
          <div className="position-absolute top-50 end-0 translate-middle-y pe-2 d-flex align-items-center gap-2">
            {voiceMode && (
              <button
                type="button"
                className={`btn btn-sm btn-link p-0 ${isListening ? 'text-danger' : 'text-muted'}`}
                onClick={handleVoiceSearch}
                aria-label="Voice search"
              >
                🎤
              </button>
            )}
            <button type="submit" className="btn btn-sm btn-link text-muted p-0" aria-label="Submit search">
              🔍
            </button>
          </div>
        </div>
      </form>

      {isFocused && query && (
        <div className="dropdown-menu show w-100 mt-1 rounded-2 shadow-sm p-0">
          {filteredResults.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {filteredResults.slice(0, 5).map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(item.path)}
                    className={`dropdown-item d-flex align-items-center gap-2 ${
                      highlightIndex === index ? 'active' : ''
                    }`}
                  >
                    <span className="fs-5">
                      {iconMap[item.type] || iconMap.default}
                    </span>
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="dropdown-item text-muted text-center py-2">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}

      {/* Voice Modal */}
      {showVoiceModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center p-4">
              {isListening ? (
                <>
                  <div className="text-danger fs-1 mb-2 animate-pulse">🎤</div>
                  <p className="mb-2">Listening... Speak now</p>
                </>
              ) : (
                <>
                  <div className="text-success fs-1 mb-2">✅</div>
                  <p className="mb-2">Searching for: <strong>{query}</strong></p>
                </>
              )}
              <button
                onClick={() => {
                  setShowVoiceModal(false);
                  setIsListening(false);
                }}
                className="btn btn-primary mt-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
