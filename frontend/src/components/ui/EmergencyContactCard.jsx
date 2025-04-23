const EmergencyContactCard = ({ name, number, icon, onCall }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
      <div className="d-flex align-items-center gap-3">
        <div className="fs-2 text-danger">
          {icon}
        </div>
        <div>
          <h5 className="card-title mb-1">{name}</h5>
          <p className="fs-5 fw-bold text-primary mb-0">{number}</p>
        </div>
      </div>

      <button
        onClick={onCall}
        className="btn btn-danger d-flex align-items-center justify-content-center gap-2 w-100 mt-3"
        aria-label={`Call ${name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call Now
      </button>
    </div>
  );
};

export default EmergencyContactCard;
