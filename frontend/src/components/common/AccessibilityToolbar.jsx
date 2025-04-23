import { useContext } from 'react';
import { AccessibilityContext } from '../../context/AccessibilityContext';

const AccessibilityToolbar = () => {
  const {
    fontSize,
    voiceMode,
    setFontSize,
    toggleVoiceMode
  } = useContext(AccessibilityContext);

  return (
    <div className="accessibility-toolbar bg-light p-2 d-flex justify-content-end gap-3">
      <div className="btn-group">
        <button 
          className={`btn btn-sm ${fontSize === 'small' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFontSize('small')}
          aria-label="Set small font size"
        >
          A
        </button>
        <button 
          className={`btn btn-sm ${fontSize === 'medium' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFontSize('medium')}
          aria-label="Set medium font size"
        >
          A
        </button>
        <button 
          className={`btn btn-sm ${fontSize === 'large' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setFontSize('large')}
          aria-label="Set large font size"
        >
          A
        </button>
      </div>

      <button 
        className={`btn btn-sm ${voiceMode ? 'btn-primary' : 'btn-outline-secondary'}`}
        onClick={toggleVoiceMode}
        aria-label="Toggle voice assistance"
      >
        <i className="bi bi-mic-fill"></i> Voice
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
