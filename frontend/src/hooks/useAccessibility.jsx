import { useState, useEffect } from 'react';

const useAccessibility = () => {
  const [fontSize, setFontSize] = useState('medium');
  const [voiceMode, setVoiceMode] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedVoiceMode = localStorage.getItem('voiceMode');

    if (savedFontSize) setFontSize(savedFontSize);
    if (savedVoiceMode === 'true') setVoiceMode(true);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('voiceMode', voiceMode);
  }, [fontSize, voiceMode]);

  // Apply font size class to document
  useEffect(() => {
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
    document.documentElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Handle voice mode
  useEffect(() => {
    if (voiceMode) {
      const msg = new SpeechSynthesisUtterance('Voice mode activated');
      window.speechSynthesis.speak(msg);
    } else {
      window.speechSynthesis.cancel();
    }
  }, [voiceMode]);

  const toggleVoiceMode = () => setVoiceMode(prev => !prev);

  return {
    fontSize,
    setFontSize,
    voiceMode,
    toggleVoiceMode,
    getTextSizeClass: () => `text-${fontSize}`
  };
};

export default useAccessibility;
