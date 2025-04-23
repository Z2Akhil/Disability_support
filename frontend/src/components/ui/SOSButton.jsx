import '../../assets/styles/SOSButton.css'; // For custom animations
import React from 'react';

const SOSButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="position-relative btn btn-danger rounded-circle border-0 fw-bold fs-4 text-white shadow-lg sos-button"
      style={{
        width: '7rem',
        height: '7rem'
      }}
    >
      {/* Glow Aura Ring */}
      <span className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-4 border-danger sos-ping-ring"></span>

      {/* Static Outline */}
      <span className="position-absolute top-0 start-0 w-100 h-100 rounded-circle border border-4 border-dark opacity-25"></span>

      {/* SOS Text */}
      <span className="position-absolute top-50 start-50 translate-middle animate-bounce">
        SOS
      </span>
    </button>
  );
};

export default SOSButton;
