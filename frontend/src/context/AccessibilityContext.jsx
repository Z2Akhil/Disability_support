import { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();
export { AccessibilityContext };

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedContrast = localStorage.getItem('highContrast');
    const savedVoiceMode = localStorage.getItem('voiceMode');
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedContrast === 'true') setHighContrast(true);
    if (savedVoiceMode === 'true') setVoiceMode(true);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('voiceMode', voiceMode);
  }, [fontSize, highContrast, voiceMode]);

  const toggleContrast = () => {
    setHighContrast(prev => !prev);
  };

  const toggleVoiceMode = () => {
    setVoiceMode(prev => !prev);
  };

  // Apply font size class to document
  useEffect(() => {
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Apply contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      highContrast,
      toggleContrast,
      voiceMode,
      toggleVoiceMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);