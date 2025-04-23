import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAccessibility from './useAccessibility';

const useVoiceCommands = () => {
  const navigate = useNavigate();
  const { setFontSize, toggleHighContrast } = useAccessibility();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('[Voice Command]', transcript);

      // === ROUTING COMMANDS ===
      if (transcript.includes('go to home')) return navigate('/');
      if (transcript.includes('open login')) return navigate('/login');
      if (transcript.includes('open signup')) return navigate('/signup');
      if (transcript.includes('contact')) return navigate('/contact');

      // === ACCESSIBILITY COMMANDS ===
      if (transcript.includes('increase font')) return setFontSize('large');
      if (transcript.includes('medium font')) return setFontSize('medium');
      if (transcript.includes('small font')) return setFontSize('small');
      if (transcript.includes('toggle contrast')) return toggleHighContrast();

      // === SCROLLING COMMANDS ===
      if (transcript.includes('scroll down')) {
        window.scrollBy({ top: 300, behavior: 'smooth' });
        return;
      }
      if (transcript.includes('scroll up')) {
        window.scrollBy({ top: -300, behavior: 'smooth' });
        return;
      }

      // === FUTURE SUPPORT ===
      // Add Hindi support: e.g. if (transcript.includes("होम खोलो")) navigate('/');
    };

    recognition.onerror = (e) => {
      console.error('[Voice Recognition Error]', e.error);
    };

    recognition.start();

    return () => recognition.stop(); // Clean up on unmount
  }, [navigate, setFontSize, toggleHighContrast]);
};

export default useVoiceCommands;
