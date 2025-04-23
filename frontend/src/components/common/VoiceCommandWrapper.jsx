// src/components/common/VoiceCommandWrapper.jsx

import useVoiceCommands from '../../hooks/useVoiceCommands';

const VoiceCommandWrapper = ({ children }) => {
  useVoiceCommands(); // safely called here, within a router context
  return children;
};

export default VoiceCommandWrapper;
